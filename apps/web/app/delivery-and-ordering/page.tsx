import React from 'react';
import Link from 'next/link';
import { Truck, Clock, CreditCard, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { EASYPAISA_NUMBER, JAZZCASH_NUMBER, OPERATING_HOURS, WHATSAPP_DISPLAY } from '@/lib/constants';

export default function DeliveryAndOrderingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Bakery Guidelines</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Delivery & Ordering Policy
        </h1>
        <p className="text-xs sm:text-sm text-[#75645A]">
          Transparent ordering terms to ensure smooth baking, secure payment, and safe delivery across Dera Ismail Khan.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Notice Requirements */}
        <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF8ED] text-[#C59A5B] flex items-center justify-center border border-[#DFCBB6]">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3A2117]">1. Advance Notice Periods</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#33241E] leading-relaxed">
            Because every sponge is baked fresh upon order confirmation:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-[#75645A] list-disc list-inside">
            <li><strong>Standard Cakes, Bento & Brownies:</strong> Minimum <strong>1 day (24 hours)</strong> advance notice.</li>
            <li><strong>Custom Theme & Tiered Cakes:</strong> Minimum <strong>2 to 3 days (48–72 hours)</strong> advance notice.</li>
          </ul>
        </div>

        {/* Section 2: Delivery Area & Charges */}
        <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF8ED] text-[#148447] flex items-center justify-center border border-[#DFCBB6]">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3A2117]">2. Delivery Area & Distance Charges</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#33241E] leading-relaxed">
            We deliver exclusively within <strong>Dera Ismail Khan city limits</strong> (Cantt, University Road, Circular Road, Topanwala, Diyal Road, Mandi Town, and surrounding urban areas).
          </p>
          <div className="bg-[#FFF8ED] p-4 rounded-xl border border-[#DFCBB6] text-xs text-[#75645A] space-y-1">
            <p><strong>Note on Delivery Fee:</strong> Delivery fee is not added at checkout because it is quoted precisely based on distance by rider upon order dispatch (usually Rs. 150 – Rs. 300 depending on your area in DI Khan).</p>
          </div>
        </div>

        {/* Section 3: Payment Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF8ED] text-[#8A6428] flex items-center justify-center border border-[#DFCBB6]">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3A2117]">3. 100% Advance Payment Policy</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#33241E] leading-relaxed">
            As a customized home-based bakery, we begin preparing your perishable ingredients once 100% advance payment is transferred:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="font-bold text-[#148447]">Easypaisa Transfer</p>
              <p className="font-serif text-base font-bold text-[#3A2117]">{EASYPAISA_NUMBER}</p>
              <p className="text-[11px] text-[#75645A]">Account: Sweet Pearl Bakes</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="font-bold text-amber-800">JazzCash Transfer</p>
              <p className="font-serif text-base font-bold text-[#3A2117]">{JAZZCASH_NUMBER}</p>
              <p className="text-[11px] text-[#75645A]">Account: Sweet Pearl Bakes</p>
            </div>
          </div>
        </div>

        {/* Section 4: Cancellation Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF8ED] text-[#B42318] flex items-center justify-center border border-[#DFCBB6]">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-[#3A2117]">4. Cancellations & Rescheduling</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#75645A] leading-relaxed">
            Orders may be rescheduled or cancelled with full store credit up to <strong>24 hours prior</strong> to the scheduled baking slot. Once the cake base is baked and customized lettering is applied, orders cannot be refunded.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/order"
          className="inline-flex items-center gap-2 bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold px-8 py-3.5 rounded-full text-xs shadow-sm transition-transform active:scale-95"
        >
          <span>Ready to Order? Start Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
