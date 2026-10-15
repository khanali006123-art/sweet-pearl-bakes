'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function WhatsAppFloating() {
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Assalam-o-Alaikum Sweet Pearl Bakes! I would like to inquire about ordering a cake in Dera Ismail Khan.'
  )}`;

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 bg-[#148447] hover:bg-[#116e3a] text-white px-4 py-3 rounded-full shadow-cocoa-lg transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat with Sweet Pearl Bakes on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 animate-bounce" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-sm font-semibold">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
}
