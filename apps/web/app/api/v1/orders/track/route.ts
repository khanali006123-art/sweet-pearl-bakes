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

    return NextResponse.json(
      {
        success: true,
        data: {
          orderNumber: orderNumber.trim().toUpperCase(),
          deliveryDate: 'Scheduled',
          status: 'Received',
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
