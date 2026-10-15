'use client';

import React, { useState } from 'react';
import { Sparkles, X, Clock } from 'lucide-react';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-[#3A2117] text-[#FFF8ED] px-4 py-2 text-xs md:text-sm font-medium border-b border-[#C59A5B]/30 flex items-center justify-between transition-all duration-300">
      <div className="flex-1 flex items-center justify-center gap-2 text-center">
        <Sparkles className="w-4 h-4 text-[#C59A5B] shrink-0 animate-pulse" />
        <span>
          <strong className="text-[#C59A5B]">Notice Guidelines:</strong> Simple cakes 1 day ahead • Bespoke & Custom cakes 2–3 days ahead in Dera Ismail Khan
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-[#FFF8ED]/70 hover:text-[#FFF8ED] p-1 rounded-full transition-colors ml-2"
        aria-label="Close announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
