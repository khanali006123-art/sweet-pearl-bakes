'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Heart,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Check,
  Truck,
  Star,
  Award,
  Layers,
  Palette
} from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { DEFAULT_PRODUCTS, WHATSAPP_NUMBER, SITE_NAME, TAGLINE } from '@/lib/constants';
import { IProduct } from '@sweetpearl/shared';

export default function HomePage() {
  const [products, setProducts] = useState<IProduct[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories = [
    {
      title: 'Designer Celebration Cakes',
      category: 'Designer Cake',
      price: 'From Rs. 1,025',
      description: 'Stunning anniversary, Nikkah, ribbon, and tiered celebration centerpieces.',
      image: '/products/gold-floral-anniversary-cake.jpg',
      href: '/menu?category=Designer%20Cake'
    },
    {
      title: 'Theme & Kids Cakes',
      category: 'Theme Cake',
      price: 'From Rs. 1,133',
      description: 'Mickey Mouse, Fairy butterfly wings, football, and purple butterfly themes.',
      image: '/products/mickey-mouse-cake.jpg',
      href: '/menu?category=Theme%20Cake'
    },
    {
      title: 'Custom & 3D Character Cakes',
      category: 'Custom Cake',
      price: 'From Rs. 1,067',
      description: 'Handcrafted teddy bear, fluffy bear face, lamb, and vintage black ribbon cakes.',
      image: '/products/cute-teddy-bear-cake.jpg',
      href: '/menu?category=Custom%20Cake'
    },
    {
      title: 'Gourmet Drip Cakes',
      category: 'Drip Cake',
      price: 'From Rs. 1,000',
      description: 'Belgian dark chocolate ganache waterfall drip cakes with rich toppings.',
      image: '/products/chocolate-drip-cake.jpg',
      href: '/menu?category=Drip%20Cake'
    },
    {
      title: 'Standard & Cream Cakes',
      category: 'Standard Cream',
      price: 'From Rs. 1,000',
      description: 'Classic Black Forest, fresh strawberry wave, and chocolate sprinkles.',
      image: '/products/black-forest-cake.jpg',
      href: '/menu?category=Standard%20Cream'
    },
    {
      title: 'Bakery Items, Breads & Treats',
      category: 'Bakery Item',
      price: 'From Rs. 100',
      description: 'Decadent chocolate brownies, Swiss rolls, filled cupcakes, and banana bread.',
      image: '/products/brownies.jpg',
      href: '/menu?category=Bakery%20Item'
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Your Treat',
      desc: 'Browse our curated menu of cakes, bento boxes, brownies, or request a custom theme.'
    },
    {
      step: '02',
      title: 'Customize Flavor & Date',
      desc: 'Pick your preferred flavor, weight, cake message, and delivery date with advance notice.'
    },
    {
      step: '03',
      title: '100% Advance Payment',
      desc: 'Transfer via Easypaisa or JazzCash and upload your payment confirmation screenshot.'
    },
    {
      step: '04',
      title: 'Live Order Tracking',
      desc: 'Track your cake in real time from baking to dispatch with your unique Order ID.'
    },
    {
      step: '05',
      title: 'Fresh Home Delivery',
      desc: 'Delivered safely to your doorstep anywhere across Dera Ismail Khan.'
    }
  ];

  const reviews = [
    {
      name: 'Dr. Maria H.',
      area: 'University Road, DI Khan',
      rating: 5,
      comment: 'The chocolate ganache cake was absolutely heavenly! Super fresh, moist, and the gold lettering was so neat. The WhatsApp ordering made everything very easy.'
    },
    {
      name: 'Zeeshan Ali',
      area: 'Cantt, Dera Ismail Khan',
      rating: 5,
      comment: 'Ordered a box of fudge brownies and a Korean bento cake for my sister’s birthday. Everyone loved the presentation. Best home bakery in DI Khan!'
    },
    {
      name: 'Sadia Malik',
      area: 'Circular Road, DI Khan',
      rating: 5,
      comment: 'They designed a customized 2-tier cake for our anniversary. Exactly like the reference photo I uploaded. Highly recommended!'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:py-24 bg-gradient-to-b from-[#FFF8ED] via-[#F2E2D0]/40 to-[#FFF8ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3A2117]/5 border border-[#C59A5B]/30 text-[#8A6428] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C59A5B]" />
                <span>Home-Based Bakery • Dera Ismail Khan</span>
              </div>

              {/* H1 Title */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#3A2117] leading-[1.15] tracking-tight">
                A Little Sweetness <br className="hidden sm:block" />
                <span className="italic font-normal text-[#8A6428]">in Every Single Bite.</span>
              </h1>

              {/* Subcopy */}
              <p className="text-[#75645A] text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Handcrafted celebration cakes, Korean bento treats, fudgy brownies, and gourmet cupcakes baked fresh with premium ingredients for your special moments in Dera Ismail Khan.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/order"
                  className="w-full sm:w-auto bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold px-8 py-3.5 rounded-full text-base shadow-cocoa transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order Online Now</span>
                </Link>

                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    'Assalam-o-Alaikum Sweet Pearl Bakes! I would like to inquire about ordering a cake in Dera Ismail Khan.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-[#148447] hover:bg-[#116e3a] text-white font-semibold px-6 py-3.5 rounded-full text-base shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Value Chips */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-medium text-[#33241E]">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#DFCBB6] shadow-sm">
                  <Check className="w-3.5 h-3.5 text-[#148447]" /> Freshly Baked to Order
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#DFCBB6] shadow-sm">
                  <Palette className="w-3.5 h-3.5 text-[#C59A5B]" /> Custom Theme Designs
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-[#DFCBB6] shadow-sm">
                  <Truck className="w-3.5 h-3.5 text-[#8A6428]" /> Dera Ismail Khan Delivery
                </span>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background aura */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#C59A5B]/20 via-[#F2E2D0] to-transparent rounded-3xl transform -rotate-2 -z-10" />

                <div className="bg-white p-3 rounded-20px shadow-cocoa-lg border border-[#DFCBB6]/70 overflow-hidden">
                  <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden group">
                    <img
                      src="/products/gold-floral-anniversary-cake.jpg"
                      alt="Handcrafted Gold Floral Anniversary Cake in Dera Ismail Khan"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-[#3A2117]/90 backdrop-blur-sm text-[#FFF8ED] p-3 rounded-xl flex items-center justify-between border border-[#C59A5B]/30">
                      <div>
                        <p className="text-xs font-semibold text-[#C59A5B]">Signature Creation</p>
                        <p className="text-sm font-serif font-bold">Gold Floral Anniversary Cake</p>
                      </div>
                      <span className="text-xs bg-[#C59A5B] text-[#3A2117] font-bold px-2.5 py-1 rounded-full">
                        From Rs. 1,240
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-3 bg-[#FFF8ED] border-2 border-[#C59A5B] rounded-2xl p-3 shadow-cocoa flex items-center gap-2.5 animate-bounce-short">
                  <div className="w-9 h-9 rounded-full bg-[#148447] text-white flex items-center justify-center font-bold text-xs">
                    ★ 4.9
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#3A2117]">DI Khan Favorite</p>
                    <p className="text-[10px] text-[#75645A]">100% Homemade Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-20px p-6 md:p-8 shadow-cocoa border border-[#DFCBB6] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <Clock className="w-6 h-6 text-[#C59A5B] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#3A2117]">Daily 10 AM – 10 PM</h4>
            <p className="text-xs text-[#75645A]">Prompt customer support</p>
          </div>
          <div className="space-y-1">
            <MapPin className="w-6 h-6 text-[#C59A5B] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#3A2117]">DI Khan Delivery</h4>
            <p className="text-xs text-[#75645A]">Distance-based careful delivery</p>
          </div>
          <div className="space-y-1">
            <ShieldCheck className="w-6 h-6 text-[#C59A5B] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#3A2117]">Advance Booking</h4>
            <p className="text-xs text-[#75645A]">1 day simple • 2-3 days custom</p>
          </div>
          <div className="space-y-1">
            <Sparkles className="w-6 h-6 text-[#C59A5B] mx-auto mb-2" />
            <h4 className="font-bold text-sm text-[#3A2117]">Easypaisa & JazzCash</h4>
            <p className="text-xs text-[#75645A]">100% advance screenshot audit</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Fresh From Our Kitchen</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
            Explore Our Sweet Categories
          </h2>
          <p className="text-sm text-[#75645A]">
            Every item is handcrafted with premium Belgian cocoa, real butter, and pure extracts for exceptional taste and presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-20px overflow-hidden border border-[#DFCBB6] shadow-cocoa hover:shadow-cocoa-lg transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#3A2117]/85 backdrop-blur-md text-[#FFF8ED] text-xs font-semibold px-3 py-1 rounded-full border border-[#C59A5B]/30">
                  {cat.price}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-[#3A2117] group-hover:text-[#8A6428] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#75645A] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between border-t border-[#DFCBB6]/40">
                  <Link
                    href={cat.href}
                    className="text-xs font-bold text-[#8A6428] hover:text-[#3A2117] flex items-center gap-1.5 group/btn"
                  >
                    <span>View Options</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/order"
                    className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-[#3A2117] hover:bg-[#542F20] text-[#FFF8ED] font-semibold px-8 py-3.5 rounded-full text-sm shadow-md transition-colors"
          >
            <span>View Complete Bakery Menu & Flavors</span>
            <ArrowRight className="w-4 h-4 text-[#C59A5B]" />
          </Link>
        </div>
      </section>

      {/* 4. Value Proposition / Mission */}
      <section className="bg-[#F2E2D0] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative">
              <div className="rounded-20px overflow-hidden shadow-cocoa border-2 border-white">
                <img
                  src="/products/ribbon-cake.jpg"
                  alt="Sweet Pearl Bakes artisan crafting cake"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">The Sweet Pearl Philosophy</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
                "Baking With Genuine Love, High Hygiene & Precision."
              </h2>
              <p className="text-[#33241E] text-sm sm:text-base leading-relaxed">
                Sweet Pearl Bakes is a dedicated home-based bakery established in Dera Ismail Khan. Unlike mass commercial bakeries, each cake is baked on demand specifically for your celebration. We do not use commercial pre-mixes or stale bases. Every sponge is whipped fresh from scratch with real butter, quality chocolate, and sanitized equipment.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-[#DFCBB6]">
                  <h4 className="font-bold text-sm text-[#3A2117] mb-1">Pure Ingredients</h4>
                  <p className="text-xs text-[#75645A]">100% real dairy butter, rich cocoa, and fresh food-grade colors.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#DFCBB6]">
                  <h4 className="font-bold text-sm text-[#3A2117] mb-1">Tailored Designs</h4>
                  <p className="text-xs text-[#75645A]">Share your favorite Instagram or Pinterest photo for custom execution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How Ordering Works (5-Step Flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Simple & Reliable Flow</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
            How Ordering Works
          </h2>
          <p className="text-sm text-[#75645A]">
            We have streamlined the ordering process to replace manual back-and-forth messaging with a clear, verified sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-20px border border-[#DFCBB6] shadow-sm relative space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="font-serif text-3xl font-black text-[#C59A5B]/40 block">
                  {st.step}
                </span>
                <h3 className="font-bold text-base text-[#3A2117]">{st.title}</h3>
                <p className="text-xs text-[#75645A] leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF8ED] border border-[#C59A5B]/40 rounded-20px p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-bold text-base text-[#3A2117]">Already placed an order with Sweet Pearl Bakes?</h4>
            <p className="text-xs text-[#75645A]">Enter your Order ID (e.g. SPB-1001) and phone number to see live status updates.</p>
          </div>
          <Link
            href="/track"
            className="bg-[#3A2117] hover:bg-[#542F20] text-[#FFF8ED] text-xs font-bold px-6 py-3 rounded-full shadow-sm shrink-0 transition-colors"
          >
            Track Order Status
          </Link>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="bg-white py-16 border-y border-[#DFCBB6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Local Love in DI Khan</span>
            <h2 className="font-serif text-3xl font-bold text-[#3A2117]">Customer Reviews</h2>
            <p className="text-xs text-[#75645A]">Verified feedback from families and dessert enthusiasts in Dera Ismail Khan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#FFF8ED] p-6 rounded-20px border border-[#DFCBB6] shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#33241E] italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#DFCBB6]/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-[#3A2117]">{rev.name}</h4>
                    <p className="text-[11px] text-[#75645A]">{rev.area}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-[#148447] font-semibold px-2 py-0.5 rounded-full">
                    Verified Customer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final High-Impact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#3A2117] text-[#FFF8ED] rounded-20px p-8 sm:p-12 md:p-16 text-center space-y-6 relative overflow-hidden shadow-cocoa-lg border-2 border-[#C59A5B]">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C59A5B]">Planning a Celebration?</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Let’s Make Your Event Sweet & Memorable.
            </h2>
            <p className="text-[#DFCBB6] text-sm sm:text-base leading-relaxed">
              Whether it’s a birthday, graduation, anniversary, or an evening craving, we look forward to baking for you in Dera Ismail Khan!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/order"
              className="w-full sm:w-auto bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold px-8 py-4 rounded-full text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Start Your Order</span>
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Assalam-o-Alaikum Sweet Pearl Bakes! I have a question about placing an order.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#FFF8ED] font-semibold px-8 py-4 rounded-full text-base border border-[#C59A5B]/40 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-[#C59A5B]" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
