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
export declare const PAYMENT_ACCOUNT_NUMBERS: {
    readonly Easypaisa: "03169403356";
    readonly JazzCash: "03306363356";
};
export type ReceiptPaymentMethod = keyof typeof PAYMENT_ACCOUNT_NUMBERS;
export type ReceiptCheckResult = {
    ok: true;
} | {
    ok: false;
    code: string;
    message: string;
};
/** A receipt upload must be a real image data URL, not an arbitrary string. */
export declare function isReceiptImageDataUrl(value: unknown): value is string;
export declare function checkReceiptText(input: {
    text: string;
    paymentMethod: ReceiptPaymentMethod;
    expectedAmountPKR: number;
}): ReceiptCheckResult;
