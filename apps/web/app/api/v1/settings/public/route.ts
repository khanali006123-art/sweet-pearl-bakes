import { NextResponse } from 'next/server';
import {
  OPERATING_HOURS,
  WHATSAPP_NUMBER,
  EASYPAISA_NUMBER,
  JAZZCASH_NUMBER,
} from '@/lib/constants';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      businessHours: OPERATING_HOURS,
      deliveryNote:
        'Delivery available exclusively within Dera Ismail Khan. Delivery fee quoted upon confirmation.',
      announcementText:
        '✨ Simple cakes: 1 day notice • Custom cakes: 2–3 days notice ✨',
      whatsappNumber: WHATSAPP_NUMBER,
      minNoticeDaysSimple: 1,
      minNoticeDaysCustom: 2,
      paymentAccounts: [
        {
          method: 'Easypaisa',
          number: EASYPAISA_NUMBER,
          title: 'Sweet Pearl Bakes (Easypaisa)',
          instructions:
            'Send 100% advance payment to 0316-9403356 & upload screenshot.',
        },
        {
          method: 'JazzCash',
          number: JAZZCASH_NUMBER,
          title: 'Sweet Pearl Bakes (JazzCash)',
          instructions:
            'Send 100% advance payment to 0330-6363356 & upload screenshot.',
        },
      ],
    },
  });
}
