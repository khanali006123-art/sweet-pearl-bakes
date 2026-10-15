'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  flavor: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Gold Floral 50th Anniversary Cake',
    category: 'Designer Cake',
    image: '/products/gold-floral-anniversary-cake.jpg',
    flavor: 'Vanilla Bean & Buttercream'
  },
  {
    id: 'g2',
    title: 'Gold Nikkah Mubarak Cake',
    category: 'Designer Cake',
    image: '/products/nikkah-cake.jpg',
    flavor: 'Royal Vanilla & Lotus Biscoff'
  },
  {
    id: 'g3',
    title: 'Mickey & Butterflies Kids Cake',
    category: 'Kids Theme',
    image: '/products/mickey-mouse-cake.jpg',
    flavor: 'Chocolate Fudge & Vanilla'
  },
  {
    id: 'g4',
    title: 'Fairy Butterfly Wings Ombre Cake',
    category: 'Theme Cake',
    image: '/products/fairy-butterfly-wings-cake.jpg',
    flavor: 'Strawberry Shortcake'
  },
  {
    id: 'g5',
    title: 'Vintage Black Ribbon Heart Cake',
    category: 'Custom Cake',
    image: '/products/vintage-black-ribbon-cake.jpg',
    flavor: 'Chocolate Ganache'
  },
  {
    id: 'g6',
    title: 'Cute Teddy Bear Bento Cake',
    category: 'Custom Cake',
    image: '/products/cute-teddy-bear-cake.jpg',
    flavor: 'Caramel Buttercream'
  },
  {
    id: 'g7',
    title: 'Classic Black Forest Cake',
    category: 'Standard Cream',
    image: '/products/black-forest-cake.jpg',
    flavor: 'Dark Chocolate & Cherry Cream'
  },
  {
    id: 'g8',
    title: 'Fresh Strawberry Wave Cake',
    category: 'Standard Cream',
    image: '/products/fresh-strawberry-cake.jpg',
    flavor: 'Fresh Strawberry Puree'
  },
  {
    id: 'g9',
    title: 'Triple Chocolate Fudge Star Cake',
    category: 'Fudge / Premium',
    image: '/products/triple-chocolate-fudge-cake.jpg',
    flavor: 'Belgian Triple Chocolate'
  },
  {
    id: 'g10',
    title: 'Ferrero Rocher Deluxe Cake',
    category: 'Premium Cake',
    image: '/products/ferrero-rocher-cake.jpg',
    flavor: 'Nutella Hazelnut Praline'
  },
  {
    id: 'g11',
    title: 'Mango Glaze Golden Sponge Cake',
    category: 'Cream Cake',
    image: '/products/mango-glaze-cake.jpg',
    flavor: 'Tropical Mango Compote'
  },
  {
    id: 'g12',
    title: 'Caramel Crunch Toffee Cake',
    category: 'Crunch Cake',
    image: '/products/caramel-crunch-cake.jpg',
    flavor: 'Salted Caramel Honeycomb'
  }
];

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const filteredItems = selectedCat === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category.toLowerCase() === selectedCat.toLowerCase());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Visual Portfolio</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Cake & Dessert Gallery
        </h1>
        <p className="text-sm text-[#75645A] leading-relaxed">
          Browse real creations handcrafted in our Dera Ismail Khan home kitchen studio. Click any photo to inspect details in full resolution.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCat === cat
                ? 'bg-[#3A2117] text-[#FFF8ED] shadow-sm'
                : 'bg-white text-[#33241E] hover:bg-[#F2E2D0] border border-[#DFCBB6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setActiveLightboxIndex(idx)}
            className="bg-white rounded-20px overflow-hidden shadow-cocoa border border-[#DFCBB6] group cursor-pointer relative aspect-square"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#3A2117]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-[#FFF8ED]">
              <span className="text-[10px] font-bold text-[#C59A5B] uppercase tracking-wider">{item.category}</span>
              <p className="font-serif text-sm font-bold">{item.title}</p>
              <p className="text-[11px] text-[#DFCBB6]">{item.flavor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-2.5 rounded-full z-10 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) => (prev! + 1) % filteredItems.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="bg-white rounded-20px max-w-2xl w-full overflow-hidden shadow-2xl border border-[#DFCBB6] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-80 sm:h-96 w-full bg-black">
              <img
                src={filteredItems[activeLightboxIndex].image}
                alt={filteredItems[activeLightboxIndex].title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#8A6428] uppercase">{filteredItems[activeLightboxIndex].category}</span>
                <h3 className="font-serif text-xl font-bold text-[#3A2117]">{filteredItems[activeLightboxIndex].title}</h3>
                <p className="text-xs text-[#75645A]">Flavor Profile: {filteredItems[activeLightboxIndex].flavor}</p>
              </div>

              <Link
                href="/order"
                onClick={() => setActiveLightboxIndex(null)}
                className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] text-xs font-bold px-6 py-2.5 rounded-full shadow-sm"
              >
                Order This Design
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
