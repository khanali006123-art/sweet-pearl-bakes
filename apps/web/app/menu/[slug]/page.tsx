'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchProductBySlug } from '@/lib/api';
import { DEFAULT_PRODUCTS, WHATSAPP_NUMBER } from '@/lib/constants';
import { IProduct } from '@sweetpearl/shared';
import { ShoppingBag, ArrowLeft, Clock, ShieldCheck, Check, MessageCircle, Heart, Share2 } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProductBySlug(slug).then((data) => {
        if (data) {
          setProduct(data);
          if (data.flavors && data.flavors.length > 0) {
            setSelectedFlavor(data.flavors[0]);
          }
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-[#C59A5B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-lg text-[#3A2117]">Loading bakery creation details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#3A2117]">Creation Not Found</h1>
        <p className="text-sm text-[#75645A]">We could not find the bakery item you requested.</p>
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 bg-[#C59A5B] text-[#3A2117] font-bold px-6 py-2.5 rounded-full text-xs shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  const selectedPriceOption = product.priceOptions[selectedOptionIndex] || product.priceOptions[0];

  const handleProceedToOrder = () => {
    const query = new URLSearchParams({
      product: product.name,
      slug: product.slug,
      flavor: selectedFlavor,
      size: selectedPriceOption.label,
      price: selectedPriceOption.amountPKR.toString()
    });
    router.push(`/order?${query.toString()}`);
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0]?.url,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Sweet Pearl Bakes',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: selectedPriceOption.amountPKR,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#75645A]">
        <Link href="/" className="hover:text-[#3A2117]">Home</Link>
        <span>/</span>
        <Link href="/menu" className="hover:text-[#3A2117]">Menu</Link>
        <span>/</span>
        <span className="text-[#3A2117] font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-20px overflow-hidden shadow-cocoa-lg border border-[#DFCBB6] relative aspect-[4/3] w-full">
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.alt || product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#3A2117]/90 backdrop-blur-sm text-[#FFF8ED] text-xs font-bold px-3 py-1 rounded-full border border-[#C59A5B]/30">
              {product.category}
            </span>
          </div>

          <div className="p-4 bg-[#FFF8ED] rounded-xl border border-[#DFCBB6] flex items-center justify-between text-xs text-[#75645A]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C59A5B]" />
              <span>
                <strong>Notice Required:</strong> Minimum {product.minNoticeDays} day{product.minNoticeDays > 1 ? 's' : ''} advance notice
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#148447] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Fresh Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Right: Product Customizer & Order CTA */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-6">
          <div className="space-y-2 border-b border-[#DFCBB6]/50 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">
              {product.category} in Dera Ismail Khan
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#75645A] leading-relaxed pt-1">
              {product.description}
            </p>
          </div>

          {/* Flavor Selection */}
          {product.flavors && product.flavors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#3A2117] block">
                Choose Sponge / Flavor Profile:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.flavors.map((flv) => (
                  <button
                    key={flv}
                    type="button"
                    onClick={() => setSelectedFlavor(flv)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                      selectedFlavor === flv
                        ? 'border-[#3A2117] bg-[#3A2117] text-[#FFF8ED] shadow-sm'
                        : 'border-[#DFCBB6] bg-[#FFF8ED] text-[#33241E] hover:border-[#C59A5B]'
                    }`}
                  >
                    <span>{flv}</span>
                    {selectedFlavor === flv && <Check className="w-3.5 h-3.5 text-[#C59A5B]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size / Portion Options */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3A2117] block">
              Select Size & Serving Quantity:
            </label>
            <div className="space-y-2">
              {product.priceOptions.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOptionIndex(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedOptionIndex === idx
                      ? 'border-[#C59A5B] bg-[#FFF8ED] ring-1 ring-[#C59A5B] shadow-sm'
                      : 'border-[#DFCBB6] hover:bg-[#FFF8ED]/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-[#3A2117]">{opt.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#3A2117]">Rs. {opt.amountPKR.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Total & Action Buttons */}
          <div className="pt-4 border-t border-[#DFCBB6]/50 space-y-4">
            <div className="flex items-center justify-between bg-[#F2E2D0]/50 p-4 rounded-xl border border-[#DFCBB6]">
              <div>
                <p className="text-xs text-[#75645A]">Estimated Base Total</p>
                <p className="text-xl font-serif font-black text-[#3A2117]">
                  Rs. {selectedPriceOption.amountPKR.toLocaleString()}
                </p>
              </div>
              <span className="text-[11px] text-[#8A6428] font-semibold bg-white px-2.5 py-1 rounded-full border border-[#DFCBB6]">
                100% Advance via Easypaisa/JazzCash
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleProceedToOrder}
                className="w-full sm:flex-1 bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Configure & Order Online</span>
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum Sweet Pearl Bakes! I want to order ${product.name} (${selectedPriceOption.label}, Flavor: ${selectedFlavor || 'Standard'}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#148447] hover:bg-[#116e3a] text-white font-semibold py-3.5 px-6 rounded-full text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
