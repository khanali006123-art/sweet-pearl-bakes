'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, ArrowRight, Sparkles, Filter, Info } from 'lucide-react';
import { fetchProducts } from '@/lib/api';
import { CATEGORIES, DEFAULT_PRODUCTS } from '@/lib/constants';
import { IProduct } from '@sweetpearl/shared';

export default function MenuPage() {
  const [products, setProducts] = useState<IProduct[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    // Read query param if passed
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const cat = urlParams.get('category');
      if (cat && CATEGORIES.includes(cat as any)) {
        setSelectedCategory(cat);
      }
    }

    fetchProducts().then((data) => {
      if (data && data.length > 0) setProducts(data);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.flavors.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Fresh Handcrafted Menu</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Our Cakes & Bakery Treats
        </h1>
        <p className="text-sm text-[#75645A] leading-relaxed">
          All items are made to order with 100% pure ingredients. Choose from our classic celebration cakes, trendy bento cakes, fudgy brownies, or request a bespoke custom theme.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 sm:p-6 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#3A2117] text-[#FFF8ED] shadow-sm'
                    : 'bg-[#FFF8ED] text-[#33241E] hover:bg-[#F2E2D0] border border-[#DFCBB6]/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#75645A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cakes, flavors, sizes..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B] placeholder-[#75645A]/60"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-20px border border-[#DFCBB6] space-y-3">
          <p className="font-serif text-xl font-bold text-[#3A2117]">No bakery treats found</p>
          <p className="text-xs text-[#75645A]">Try selecting another category or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 bg-[#C59A5B] text-[#3A2117] text-xs font-bold px-4 py-2 rounded-full"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const minPrice = product.priceOptions?.[0]?.amountPKR || 0;
            const priceLabel =
              product.priceMode === 'quote'
                ? 'Quote on Design'
                : product.priceMode === 'from'
                ? `From Rs. ${minPrice.toLocaleString()}`
                : `Rs. ${minPrice.toLocaleString()}`;

            return (
              <div
                key={product._id || product.slug}
                className="bg-white rounded-20px overflow-hidden border border-[#DFCBB6] shadow-cocoa hover:shadow-cocoa-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Image with Notice Pill */}
                  <div className="relative h-60 w-full overflow-hidden bg-[#F2E2D0]">
                    <img
                      src={product.images[0]?.url || '/products/gold-floral-anniversary-cake.jpg'}
                      alt={product.images[0]?.alt || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#3A2117]/85 backdrop-blur-md text-[#FFF8ED] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#C59A5B]/30">
                      {product.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#C59A5B] text-[#3A2117] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {priceLabel}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-6 space-y-2">
                    <h3 className="font-serif text-xl font-bold text-[#3A2117] group-hover:text-[#8A6428] transition-colors">
                      <Link href={`/menu/${product.slug}`}>{product.name}</Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-[#75645A] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Flavors Pill Strip */}
                    {product.flavors && product.flavors.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1.5">
                        {product.flavors.slice(0, 3).map((flv, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFF8ED] text-[#8A6428] border border-[#DFCBB6]/70 font-medium"
                          >
                            {flv}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-4 border-t border-[#DFCBB6]/40 flex items-center justify-between gap-3 mt-4">
                  <Link
                    href={`/menu/${product.slug}`}
                    className="text-xs font-bold text-[#33241E] hover:text-[#8A6428] flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="p-2 rounded-full hover:bg-[#FFF8ED] text-[#75645A] border border-[#DFCBB6] transition-colors"
                      title="Quick Preview"
                      aria-label="Quick Preview"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <Link
                      href={`/order?product=${encodeURIComponent(product.name)}&slug=${product.slug}`}
                      className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-transform active:scale-95 flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Accessible Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-20px max-w-lg w-full overflow-hidden shadow-2xl border border-[#DFCBB6] relative space-y-6">
            <div className="relative h-64 w-full">
              <img
                src={quickViewProduct.images[0]?.url}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-3 right-3 bg-[#3A2117]/80 hover:bg-[#3A2117] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#8A6428] uppercase">{quickViewProduct.category}</span>
                <h3 className="font-serif text-2xl font-bold text-[#3A2117]">{quickViewProduct.name}</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#75645A] leading-relaxed">
                {quickViewProduct.description}
              </p>

              <div className="bg-[#FFF8ED] p-4 rounded-xl border border-[#DFCBB6] space-y-2">
                <h4 className="font-bold text-xs text-[#3A2117]">Pricing & Portion Tiers (PKR):</h4>
                <div className="space-y-1 text-xs">
                  {quickViewProduct.priceOptions.map((opt, i) => (
                    <div key={i} className="flex justify-between text-[#33241E]">
                      <span>{opt.label}</span>
                      <span className="font-bold">Rs. {opt.amountPKR.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href={`/menu/${quickViewProduct.slug}`}
                  className="w-1/2 py-2.5 rounded-full border border-[#DFCBB6] text-xs font-bold text-center hover:bg-[#FFF8ED]"
                >
                  Full Details
                </Link>
                <Link
                  href={`/order?product=${encodeURIComponent(quickViewProduct.name)}&slug=${quickViewProduct.slug}`}
                  className="w-1/2 py-2.5 rounded-full bg-[#C59A5B] text-[#3A2117] text-xs font-bold text-center hover:bg-[#b08749] shadow-sm"
                >
                  Proceed to Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
