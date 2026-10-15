import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Award, ShieldCheck, ShoppingBag, MapPin } from 'lucide-react';
import { SITE_NAME, TAGLINE } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Our Story & Kitchen</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          About Sweet Pearl Bakes
        </h1>
        <p className="text-sm text-[#75645A] leading-relaxed">
          "{TAGLINE}" — Handcrafted with patience, care, and the finest ingredients in Dera Ismail Khan.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="rounded-20px overflow-hidden shadow-cocoa-lg border-2 border-white">
            <img
              src="/products/vintage-black-ribbon-cake.jpg"
              alt="Sweet Pearl Bakes artisan cake studio"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-serif text-3xl font-bold text-[#3A2117]">
            From Home Kitchen to DI Khan’s Favorite Celebrations
          </h2>
          <p className="text-sm text-[#33241E] leading-relaxed">
            Sweet Pearl Bakes started with a simple belief: every special celebration deserves a centerpiece cake made from genuine, wholesome ingredients rather than mass-produced artificial powders and commercial bases.
          </p>
          <p className="text-sm text-[#33241E] leading-relaxed">
            Based right here in Dera Ismail Khan, Khyber Pakhtunkhwa, we specialize in modern confectionery trends—from minimalist Korean lunchbox bento cakes to fudgy, crackly chocolate brownies and tailored 2-tier wedding cakes.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-[#DFCBB6]">
              <ShieldCheck className="w-5 h-5 text-[#148447] mb-1.5" />
              <h4 className="font-bold text-sm text-[#3A2117]">Sanitized Studio</h4>
              <p className="text-xs text-[#75645A]">Strict food-grade kitchen hygiene and sterile packaging.</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-[#DFCBB6]">
              <Award className="w-5 h-5 text-[#C59A5B] mb-1.5" />
              <h4 className="font-bold text-sm text-[#3A2117]">100% Real Butter</h4>
              <p className="text-xs text-[#75645A]">No artificial hydrogenated vegetable fats or shortcuts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#FFF8ED] rounded-20px p-8 sm:p-12 border border-[#C59A5B]/40 text-center space-y-4 shadow-sm max-w-2xl mx-auto">
        <h3 className="font-serif text-2xl font-bold text-[#3A2117]">Taste the Sweet Pearl Difference</h3>
        <p className="text-xs sm:text-sm text-[#75645A]">
          Explore our menu and schedule your next birthday, graduation, or family treat with advance booking.
        </p>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold px-8 py-3.5 rounded-full text-xs shadow-md transition-transform active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Place an Order</span>
        </Link>
      </div>
    </div>
  );
}
