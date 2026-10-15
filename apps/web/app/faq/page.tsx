'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How far in advance should I order my cake in Dera Ismail Khan?',
    a: 'For our standard celebration cakes, bento boxes, and brownies, we require at least 1 day (24 hours) notice. For bespoke multi-tiered custom cakes with intricate theme decorations or toppers, please order 2–3 days ahead.',
    category: 'Ordering'
  },
  {
    q: 'Which areas do you deliver to in Dera Ismail Khan?',
    a: 'We deliver throughout Dera Ismail Khan city limits including University Road, Cantt, Circular Road, Topanwala Chowk, Mandi Town, Diyal Road, and nearby residential societies. Delivery fee is quoted by distance by our courier partner upon dispatch.',
    category: 'Delivery'
  },
  {
    q: 'How does payment verification work?',
    a: 'We require 100% advance payment via Easypaisa (0316-9403356) or JazzCash (0330-6363356). When filling out the order form on our website, simply upload a screenshot of your transaction receipt. Our team verifies the transaction and updates your order status to "Payment Verified".',
    category: 'Payment'
  },
  {
    q: 'Can I provide my own cake design from Pinterest or Instagram?',
    a: 'Yes! We love bespoke creations. Go to our "Custom Cakes" page to upload your reference picture and specify your desired flavor and weight. You can also send the picture directly on WhatsApp for a custom quotation.',
    category: 'Customization'
  },
  {
    q: 'How can I track the baking status of my order?',
    a: 'Visit our "Track Order" page and enter your unique Order Number (e.g. SPB-1001) along with the phone number you provided during checkout. You can watch your cake progress from "Order Received" to "Payment Verified", "Preparing", and "Out for Delivery".',
    category: 'Ordering'
  },
  {
    q: 'Are your bakery products 100% halal and fresh?',
    a: 'Absolutely. We use 100% halal food-grade certified ingredients, pure dairy butter, premium cocoa, and fresh farm eggs. Every item is baked fresh specifically for your order—never frozen or pre-stored.',
    category: 'Quality'
  }
];

export default function FAQPage() {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Got Questions?</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#75645A]">
          Find quick answers about ordering, advance notice, delivery areas, and custom creations in Dera Ismail Khan.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md mx-auto">
        <Search className="w-4 h-4 text-[#75645A] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search question or topic..."
          className="w-full pl-9 pr-4 py-3 rounded-full bg-white text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B] shadow-sm placeholder-[#75645A]/60"
        />
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-20px overflow-hidden border border-[#DFCBB6] shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FFF8ED]/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base sm:text-lg font-bold text-[#3A2117]">
                  {faq.q}
                </span>
                <span className="text-[#C59A5B] shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#75645A] leading-relaxed border-t border-[#DFCBB6]/40">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Box */}
      <div className="bg-[#FFF8ED] rounded-20px p-6 sm:p-8 border border-[#C59A5B]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-[#3A2117]">Have a question not listed here?</h3>
          <p className="text-xs text-[#75645A]">We are available daily on WhatsApp from 10:00 AM to 10:00 PM.</p>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#148447] hover:bg-[#116e3a] text-white font-bold text-xs px-6 py-3 rounded-full flex items-center gap-2 shadow-sm shrink-0"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Ask on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
