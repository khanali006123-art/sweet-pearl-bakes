"use strict";
/**
 * Receipt authenticity checks for Sweet Pearl Bakes advance payments.
 *
 * The order form already requires a payment method and a receipt upload, but
 * those checks only prove that *some* file was attached. These helpers verify
 * that the uploaded image actually looks like a genuine Easypaisa/JazzCash
 * receipt for THIS order: it must show the bakery's account number, the exact
 * order amount, and a transaction confirmation. A random photo fails all of
 * these, so it can never confirm an order.
 *
 * This module is intentionally pure (no OCR engine inside) so it can be unit
 * tested and shared by both the Next.js route handler and the Express API.
 * OCR text extraction lives in each app's receiptOcr wrapper.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_ACCOUNT_NUMBERS = void 0;
exports.isReceiptImageDataUrl = isReceiptImageDataUrl;
exports.checkReceiptText = checkReceiptText;
exports.PAYMENT_ACCOUNT_NUMBERS = {
    Easypaisa: '03169403356',
    JazzCash: '03306363356',
};
/** A receipt upload must be a real image data URL, not an arbitrary string. */
function isReceiptImageDataUrl(value) {
    return (typeof value === 'string' &&
        /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=\s]+$/.test(value.trim()));
}
/**
 * Match an account number allowing only spaces, dots or dashes between its
 * digits, e.g. "0316 9403356", "0316-9403356" or "03169403356".
 */
function accountNumberPattern(digits) {
    return new RegExp(digits.split('').join('[ .\\-]*'));
}
function checkReceiptText(input) {
    const { text, paymentMethod, expectedAmountPKR } = input;
    const accountNumber = exports.PAYMENT_ACCOUNT_NUMBERS[paymentMethod];
    // 1. The receipt must show a transfer to OUR account number.
    if (!accountNumberPattern(accountNumber).test(text)) {
        return {
            ok: false,
            code: 'account_number_missing',
            message: `We could not find the ${paymentMethod} account number (${accountNumber}) in your receipt. Please upload the original receipt screenshot showing a transfer to this number.`,
        };
    }
    // 2. The receipt must show the exact order amount (commas/".00" tolerated).
    const amountStr = String(Math.round(expectedAmountPKR));
    const grouped = Number(amountStr).toLocaleString('en-US');
    const flatText = text.replace(/,/g, '');
    if (!flatText.includes(amountStr) &&
        !flatText.includes(`${amountStr}.00`) &&
        !flatText.includes(`${amountStr}.0`)) {
        return {
            ok: false,
            code: 'amount_missing',
            message: `We could not find the order amount (Rs. ${grouped}) in your receipt. Please upload the original receipt for the full advance payment.`,
        };
    }
    // 3. The receipt must show a successful payment with a transaction ID.
    // The account number and the amount themselves do not count as the ID.
    const hasSuccess = /successful|successfully|completed|payment sent|money sent|transfer successful|transaction successful/i.test(text);
    const tokens = text.match(/[A-Za-z0-9]+/g) || [];
    const hasTxnId = tokens.some((token) => {
        if (token === accountNumber || token === amountStr)
            return false;
        const hasLetter = /[A-Za-z]/.test(token);
        const hasDigit = /\d/.test(token);
        if (token.length >= 8 && hasLetter && hasDigit)
            return true;
        if (/^\d{9,}$/.test(token))
            return true;
        return false;
    });
    if (!hasSuccess || !hasTxnId) {
        return {
            ok: false,
            code: 'transaction_missing',
            message: 'We could not find a transaction ID or successful-payment confirmation in your receipt. Please upload the complete original receipt screenshot.',
        };
    }
    return { ok: true };
}
