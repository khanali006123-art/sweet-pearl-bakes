import { NextResponse } from 'next/server';
import { WHATSAPP_NUMBER } from '@/lib/constants';

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
    const items = body.items || [];
    const itemsTotal = items.reduce(
      (acc: number, item: any) =>
        acc + (Number(item.unitPricePKR || 0) * Number(item.quantity || 1)),
      0
    );

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
        message: 'Order created successfully. Advance payment receipt submitted for verification.',
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
