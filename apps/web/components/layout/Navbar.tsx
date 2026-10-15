'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, Clock, ShoppingBag, MessageCircle } from 'lucide-react';
import { NAV_LINKS, SITE_NAME, WHATSAPP_NUMBER } from '@/lib/constants';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check operating hours 10:00 AM - 10:00 PM in local time
    const now = new Date();
    const hour = now.getHours();
    setIsOpenNow(hour >= 10 && hour < 22);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#FFF8ED]/95 backdrop-blur-md shadow-cocoa border-b border-[#DFCBB6]' : 'bg-[#FFF8ED] border-b border-[#DFCBB6]/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-sm ring-2 ring-[#C59A5B]/70 group-hover:ring-[#C59A5B] transition-all bg-[#FFF8ED] shrink-0">
              <Image
                src="/logo.png"
                alt="Sweet Pearls Bakes Logo"
                fill
                sizes="56px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#3A2117] block leading-none">
                {SITE_NAME}
              </span>
              <span className="text-[11px] tracking-wider uppercase font-semibold text-[#8A6428]">
                Dera Ismail Khan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#8A6428] relative py-1 ${
                    active ? 'text-[#8A6428] font-semibold' : 'text-[#33241E]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C59A5B] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Status */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Live Open / Pre-Order Badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                isOpenNow
                  ? 'bg-emerald-50 text-[#148447] border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title="Daily hours: 10:00 AM – 10:00 PM"
            >
              <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-[#148447] animate-pulse' : 'bg-amber-500'}`} />
              <span>{isOpenNow ? 'Open Now (10 AM-10 PM)' : 'Taking Advance Orders'}</span>
            </div>

            <Link
              href="/order"
              className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-semibold px-5 py-2.5 rounded-full text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order Now</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/order"
              className="bg-[#C59A5B] text-[#3A2117] font-semibold px-3.5 py-2 rounded-full text-xs flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Order</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#3A2117] hover:bg-[#F2E2D0] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#FFF8ED] border-b border-[#DFCBB6] px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-[#DFCBB6]/50">
            <span className="text-xs text-[#75645A]">
              📍 Delivering to Dera Ismail Khan
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                isOpenNow ? 'bg-emerald-100 text-[#148447]' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isOpenNow ? 'Open 10 AM - 10 PM' : 'Advance Orders'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-[#3A2117] text-[#FFF8ED]' : 'hover:bg-[#F2E2D0] text-[#33241E]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#DFCBB6]/50 flex flex-col gap-2">
            <Link
              href="/order"
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-semibold py-3 rounded-full text-center text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Start Online Order</span>
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#148447] hover:bg-[#116e3a] text-white font-medium py-2.5 rounded-full text-center text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
