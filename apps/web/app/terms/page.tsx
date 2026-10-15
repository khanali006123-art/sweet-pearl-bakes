import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">Order Terms & Conditions</h1>
        <p className="text-xs text-[#75645A]">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-6 text-xs sm:text-sm text-[#33241E] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">1. Order Placement & Advance Notice</h2>
          <p>
            Orders for simple cakes, bento boxes, and brownies must be placed at least 1 day (24 hours) in advance. Custom theme and tiered cakes require at least 2–3 days advance booking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">2. Advance Payment Policy</h2>
          <p>
            Orders are confirmed only after 100% advance payment is transferred via Easypaisa or JazzCash and verified with a valid receipt screenshot.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">3. Deliveries & Handover</h2>
          <p>
            Deliveries are restricted to Dera Ismail Khan city limits. Delivery fees are quoted separately based on exact distance. Customers must ensure an authorized person is available to receive delicate baked goods upon arrival.
          </p>
        </section>
      </div>
    </div>
  );
}
