import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">Privacy Policy</h1>
        <p className="text-xs text-[#75645A]">Last updated: October 2026</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-6 text-xs sm:text-sm text-[#33241E] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">1. Information We Collect</h2>
          <p>
            When you place an order with Sweet Pearl Bakes, we collect your name, phone number, delivery address in Dera Ismail Khan, and payment screenshot proof for the sole purpose of baking, verifying payment, and safely delivering your order.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">2. Order Tracking Privacy</h2>
          <p>
            Our public order tracking system requires both your unique Order Number and the phone number provided at checkout. Sensitive details such as full home addresses are never exposed in public tracking responses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">3. Data Security & Storage</h2>
          <p>
            We do not sell, trade, or share your personal contact details with third-party advertising companies. Data is used exclusively by our home bakery staff to coordinate dispatch and customer service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#3A2117]">4. Contact Us</h2>
          <p>
            For any privacy inquiries or to update your details, please contact us via WhatsApp or through our <Link href="/contact" className="text-[#8A6428] font-bold underline">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
