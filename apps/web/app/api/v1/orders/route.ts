import { NextResponse } from 'next/server';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { extractReceiptText } from '@/lib/receiptOcr';
import {
  checkReceiptText,
  isReceiptImageDataUrl,
  type ReceiptPaymentMethod,
} from '@sweetpearl/shared';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Mandatory Payment Method Validation
    if (!body.paymentMethod || !['Easypaisa', 'JazzCash'].includes(body.paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please select a payment method and pay the required advance payment before confirming your order.',
        },
        { status: 400 }
      );
    }

    // 2. Mandatory Payment Receipt Validation
    if (!body.paymentProofUrl || typeof body.paymentProofUrl !== 'string' || !body.paymentProofUrl.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please upload your advance payment receipt before confirming your order.',
        },
        { status: 400 }
      );
    }

    // 2b. The receipt must be a real uploaded image, not an arbitrary string.
    if (!isReceiptImageDataUrl(body.paymentProofUrl)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please upload a valid payment receipt image (screenshot) before confirming your order.',
        },
        { status: 400 }
      );
    }

    // Order total, needed to verify the receipt amount (and reused below).
    const items = body.items || [];
    const itemsTotal = items.reduce(
      (acc: number, item: any) =>
        acc + (Number(item.unitPricePKR || 0) * Number(item.quantity || 1)),
      0
    );

    // 2c. Receipt authenticity: the image must actually look like a genuine
    // receipt for THIS order — our account number, the exact order amount,
    // and a transaction confirmation. A random photo fails here, so it can
    // never confirm an order. Any OCR failure is a rejection, never a pass.
    let receiptText: string;
    try {
      receiptText = await extractReceiptText(body.paymentProofUrl);
    } catch (ocrErr) {
      return NextResponse.json(
        {
          success: false,
          message:
            'We could not read your receipt. Please upload a clear, complete screenshot of your original payment receipt and try again.',
        },
        { status: 400 }
      );
    }
    const receiptCheck = checkReceiptText({
      text: receiptText,
      paymentMethod: body.paymentMethod as ReceiptPaymentMethod,
      expectedAmountPKR: itemsTotal,
    });
    if (!receiptCheck.ok) {
      return NextResponse.json(
        {
          success: false,
          message: receiptCheck.message,
        },
        { status: 400 }
      );
    }

    // Forward to Express Backend API if available
    const apiTarget = (process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const backendRes = await fetch(`${apiTarget}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const contentType = backendRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const backendData = await backendRes.json();
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendErr) {
      // Backend offline or unreachable fallback
    }

    // Serverless fallback with strict Pending Payment Verification status
    const orderNumber = `SPB-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsSummary = items
      .map(
        (i: any) =>
          `${i.quantity}x ${i.productName} (${i.sizeLabel || ''}, ${i.flavor || ''})`
      )
      .join(', ');

    const waText = encodeURIComponent(
      `Assalam-o-Alaikum Sweet Pearl Bakes! I just placed Order #${orderNumber}.\n\nItems: ${itemsSummary}\nDelivery Date: ${body.deliveryDate || ''}\nName: ${body.customer?.name || ''}\nTotal: Rs. ${itemsTotal.toLocaleString()}\nPayment via: ${body.paymentMethod} (Advance receipt attached)\nStatus: Pending Payment Verification`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Order request received. Advance payment receipt submitted for verification — your order will be confirmed only after the receipt is verified.',
        data: {
          orderNumber,
          totalPKR: itemsTotal,
          deliveryDate: body.deliveryDate,
          status: 'Pending Payment Verification',
          paymentStatus: 'Pending',
          whatsappUrl,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Failed to process order',
      },
      { status: 400 }
    );
  }
}
