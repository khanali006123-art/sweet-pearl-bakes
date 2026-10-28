import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderNumber, phone } = await request.json();
    if (!orderNumber || !phone) {
      return NextResponse.json(
        {
          success: false,
          message: 'Order number and phone number are required',
        },
        { status: 400 }
      );
    }

    // Forward to Express Backend API if available
    const apiTarget = (process.env.API_URL || 'http://localhost:5000').replace(/\/$/, '');
    try {
      const backendRes = await fetch(`${apiTarget}/api/v1/orders/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, phone }),
      });

      const contentType = backendRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const backendData = await backendRes.json();
        return NextResponse.json(backendData, { status: backendRes.status });
      }
    } catch (backendErr) {
      // Backend offline
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          orderNumber: orderNumber.trim().toUpperCase(),
          deliveryDate: 'Scheduled',
          status: 'Pending Payment Verification',
          paymentStatus: 'Pending',
          items: [],
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Tracking failed',
      },
      { status: 400 }
    );
  }
}
