import React from 'react';
import Link from 'next/link';
import { Cake, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#FFF8ED] text-[#C59A5B] border border-[#DFCBB6] flex items-center justify-center mx-auto shadow-sm">
        <Cake className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">404 Error</span>
        <h1 className="font-serif text-4xl font-bold text-[#3A2117]">Slice Not Found</h1>
        <p className="text-xs sm:text-sm text-[#75645A] leading-relaxed">
          The page you are looking for might have been moved or doesn’t exist in our bakery catalog.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="w-full sm:w-auto bg-[#3A2117] hover:bg-[#542F20] text-[#FFF8ED] font-bold px-6 py-3 rounded-full text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/menu"
          className="w-full sm:w-auto bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold px-6 py-3 rounded-full text-xs shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Menu</span>
        </Link>
      </div>
    </div>
  );
}
