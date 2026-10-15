'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin, Clock, Heart, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SITE_NAME, TAGLINE, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, OPERATING_HOURS, EASYPAISA_NUMBER, JAZZCASH_NUMBER } from '@/lib/constants';
import { submitNewsletter } from '@/lib/api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedback('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');
      await submitNewsletter(email);
      setStatus('success');
      setFeedback('Thank you for subscribing! We will share occasional sweet updates.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message || 'Subscription failed. Please try again.');
    }
  };

  return (
    <footer className="bg-[#3A2117] text-[#FFF8ED] pt-16 pb-12 border-t-4 border-[#C59A5B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#C59A5B] shrink-0 bg-[#FFF8ED]">
                <Image
                  src="/logo.png"
                  alt="Sweet Pearls Bakes Logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FFF8ED]">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-[#DFCBB6] text-sm leading-relaxed">
              "{TAGLINE}" — Artisanal home-based bakery located in Dera Ismail Khan. Specializing in customized birthday cakes, Korean bento treats, fudgy brownies, and gourmet cupcakes.
            </p>
            <div className="pt-2 text-xs text-[#C59A5B] font-medium flex items-center gap-1.5">
              <span>💳 Easypaisa: {EASYPAISA_NUMBER}</span>
              <span>•</span>
              <span>JazzCash: {JAZZCASH_NUMBER}</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C59A5B]">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm text-[#DFCBB6]">
              <li>
                <Link href="/menu" className="hover:text-[#FFF8ED] transition-colors">
                  Bakery Catalog & Pricing
                </Link>
              </li>
              <li>
                <Link href="/custom-cakes" className="hover:text-[#FFF8ED] transition-colors">
                  Custom Event & Theme Cakes
                </Link>
              </li>
              <li>
                <Link href="/order" className="hover:text-[#FFF8ED] transition-colors font-medium text-[#C59A5B]">
                  Online Order Form
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-[#FFF8ED] transition-colors">
                  Track Your Order Status
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[#FFF8ED] transition-colors">
                  Artisanal Cake Showcase
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFF8ED] transition-colors">
                  Our Story & Ingredients
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C59A5B]">Location & Timing</h3>
            <ul className="space-y-3 text-sm text-[#DFCBB6]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59A5B] shrink-0 mt-0.5" />
                <span>Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan (Home Kitchen Studio)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C59A5B] shrink-0" />
                <span>{OPERATING_HOURS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59A5B] shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFF8ED] underline decoration-[#C59A5B]"
                >
                  WhatsApp: {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#C59A5B]">Sweet Updates</h3>
            <p className="text-xs text-[#DFCBB6] leading-relaxed">
              Subscribe to receive seasonal menu announcements and holiday discount alerts in Dera Ismail Khan.
            </p>

            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="flex rounded-full bg-[#542F20] p-1 border border-[#DFCBB6]/30 focus-within:border-[#C59A5B]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="bg-transparent text-[#FFF8ED] text-xs px-3 py-2 flex-1 focus:outline-none placeholder-[#DFCBB6]/50"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] px-3.5 py-2 rounded-full text-xs font-semibold flex items-center gap-1 transition-transform active:scale-95 disabled:opacity-50"
                  aria-label="Subscribe to newsletter"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{feedback}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{feedback}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-[#DFCBB6]/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#DFCBB6]">
          <p>© {new Date().getFullYear()} Sweet Pearl Bakes. Handcrafted in Dera Ismail Khan. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/delivery-and-ordering" className="hover:text-[#FFF8ED] transition-colors">
              Delivery Policy
            </Link>
            <Link href="/privacy" className="hover:text-[#FFF8ED] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#FFF8ED] transition-colors">
              Order Terms
            </Link>
            <Link href="/admin/login" className="text-[#C59A5B]/80 hover:text-[#C59A5B] transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
