import { NextResponse } from 'next/server';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      `Assalam-o-Alaikum Sweet Pearl Bakes! I just placed Order #${orderNumber}.\n\nItems: ${itemsSummary}\nDelivery Date: ${body.deliveryDate || ''}\nName: ${body.customer?.name || ''}\nTotal: Rs. ${itemsTotal.toLocaleString()}\nPayment via: ${body.paymentMethod || 'Easypaisa'}`
    );
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        data: {
          orderNumber,
          totalPKR: itemsTotal,
          deliveryDate: body.deliveryDate,
          status: 'Received',
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
