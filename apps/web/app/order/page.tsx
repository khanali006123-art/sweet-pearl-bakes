'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  CheckCircle2,
  Copy,
  MessageCircle,
  Upload,
  Calendar,
  AlertCircle,
  MapPin,
  Clock,
  Sparkles,
  CreditCard,
  Check
} from 'lucide-react';
import { submitOrder } from '@/lib/api';
import { DEFAULT_PRODUCTS, EASYPAISA_NUMBER, JAZZCASH_NUMBER, WHATSAPP_NUMBER } from '@/lib/constants';

export default function OrderPage() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedProductName, setSelectedProductName] = useState(
    searchParams?.get('product') || DEFAULT_PRODUCTS[0].name
  );
  const [selectedFlavor, setSelectedFlavor] = useState(
    searchParams?.get('flavor') || 'Chocolate Ganache'
  );
  const [selectedSize, setSelectedSize] = useState(
    searchParams?.get('size') || '2 lbs (Serves 8-12)'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState(searchParams?.get('name') || '');
  const [customerPhone, setCustomerPhone] = useState(searchParams?.get('phone') || '');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(searchParams?.get('date') || '');
  const [instructions, setInstructions] = useState(searchParams?.get('instructions') || '');
  const [paymentMethod, setPaymentMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
  const [proofDataUrl, setProofDataUrl] = useState('');
  const [designDataUrl, setDesignDataUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Set minimum date to tomorrow
  const minDateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const currentProduct =
    products.find((p) => p.name === selectedProductName) || products[0];

  const currentPriceOption =
    currentProduct.priceOptions.find((opt) => opt.label === selectedSize) ||
    currentProduct.priceOptions[0];

  const unitPrice = currentPriceOption?.amountPKR || 0;
  const grandTotal = unitPrice * quantity;

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Payment proof must be under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!deliveryDate) {
      setErrorMsg('Please select a required delivery date.');
      return;
    }

    if (!deliveryAddress || deliveryAddress.length < 5) {
      setErrorMsg('Please provide a complete delivery address within Dera Ismail Khan.');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customer: {
          name: customerName,
          phone: customerPhone,
          email: customerEmail || undefined,
        },
        deliveryAddress,
        items: [
          {
            productName: currentProduct.name,
            flavor: selectedFlavor,
            sizeLabel: currentPriceOption.label,
            quantity: Number(quantity),
            unitPricePKR: unitPrice,
          },
        ],
        deliveryDate,
        instructions: instructions || undefined,
        designImageUrl: designDataUrl || undefined,
        paymentMethod,
        paymentProofUrl: proofDataUrl || undefined,
        source: 'web',
      };

      const res = await submitOrder(orderPayload);
      setCompletedOrder(res.data);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C59A5B', '#3A2117', '#148447', '#FFF8ED'],
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit order. Please check all fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderNumber = () => {
    if (completedOrder?.orderNumber) {
      navigator.clipboard.writeText(completedOrder.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {completedOrder ? (
        /* Order Confirmation View */
        <div className="bg-white rounded-20px p-8 sm:p-12 shadow-cocoa-lg border-2 border-[#C59A5B] text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-[#148447] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">
              Order Confirmed & Scheduled
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
              Shukriya! Your Order is Placed.
            </h1>
            <p className="text-sm text-[#75645A] max-w-lg mx-auto">
              We have received your order details for delivery in Dera Ismail Khan. Our team will verify the payment and begin prepping your fresh cake!
            </p>
          </div>

          {/* Order Number Box */}
          <div className="bg-[#FFF8ED] p-6 rounded-20px border border-[#DFCBB6] max-w-md mx-auto space-y-3">
            <p className="text-xs text-[#75645A] uppercase font-semibold">Your Tracking Number</p>
            <div className="flex items-center justify-center gap-3">
              <span className="font-serif text-3xl font-black text-[#3A2117] tracking-wider">
                {completedOrder.orderNumber}
              </span>
              <button
                onClick={copyOrderNumber}
                className="p-2 rounded-lg bg-white border border-[#DFCBB6] hover:bg-[#F2E2D0] text-[#3A2117] transition-colors"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copied ? <Check className="w-4 h-4 text-[#148447]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && <p className="text-[11px] text-[#148447] font-semibold">Copied to clipboard!</p>}

            <div className="pt-3 border-t border-[#DFCBB6]/60 flex justify-between text-xs text-[#33241E]">
              <span>Delivery Date: <strong>{completedOrder.deliveryDate}</strong></span>
              <span>Total: <strong>Rs. {completedOrder.totalPKR?.toLocaleString()}</strong></span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            {completedOrder.whatsappUrl && (
              <a
                href={completedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#148447] hover:bg-[#116e3a] text-white font-bold py-3.5 px-6 rounded-full text-xs shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
            )}

            <Link
              href={`/track?order=${completedOrder.orderNumber}&phone=${customerPhone}`}
              className="w-full bg-[#3A2117] hover:bg-[#542F20] text-[#FFF8ED] font-bold py-3.5 px-6 rounded-full text-xs shadow-sm transition-colors text-center"
            >
              Track Order Live
            </Link>
          </div>
        </div>
      ) : (
        /* Order Form */
        <div className="bg-white rounded-20px p-6 sm:p-10 shadow-cocoa-lg border border-[#DFCBB6] space-y-8">
          <div className="border-b border-[#DFCBB6]/50 pb-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">
              Online Bakery Checkout
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3A2117]">
              Place Your Cake Order
            </h1>
            <p className="text-xs sm:text-sm text-[#75645A]">
              Freshly baked with love in Dera Ismail Khan. Please complete the form below with 100% advance payment to lock your date.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Customer Info */}
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#3A2117] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C59A5B] text-[#3A2117] text-xs flex items-center justify-center font-bold">1</span>
                <span>Contact & Delivery Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Pakistani Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 0330 1234567"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  />
                  <span className="text-[10px] text-[#75645A]">Used for order tracking and WhatsApp updates</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3A2117]">Delivery Address (Inside Dera Ismail Khan) *</label>
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House / Street / Mohallah / Area in Dera Ismail Khan (e.g. Near Gomal University / Cantt)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                />
                <span className="text-[10px] text-[#8A6428]">Delivery fee is quoted separately by distance upon dispatch.</span>
              </div>
            </div>

            {/* Step 2: Item Selection & Customization */}
            <div className="space-y-4 pt-4 border-t border-[#DFCBB6]/50">
              <h2 className="font-serif text-lg font-bold text-[#3A2117] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C59A5B] text-[#3A2117] text-xs flex items-center justify-center font-bold">2</span>
                <span>Cake Selection & Customization</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Selected Product *</label>
                  <select
                    value={selectedProductName}
                    onChange={(e) => {
                      setSelectedProductName(e.target.value);
                      const prod = products.find((p) => p.name === e.target.value);
                      if (prod && prod.flavors.length > 0) setSelectedFlavor(prod.flavors[0]);
                      if (prod && prod.priceOptions.length > 0) setSelectedSize(prod.priceOptions[0].label);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  >
                    {products.map((p) => (
                      <option key={p.name} value={p.name}>{p.name} ({p.category})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Sponge / Flavor *</label>
                  <select
                    value={selectedFlavor}
                    onChange={(e) => setSelectedFlavor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  >
                    {(currentProduct.flavors.length > 0
                      ? currentProduct.flavors
                      : ['Chocolate Ganache', 'Vanilla Bean', 'Red Velvet', 'Strawberry Swirl']
                    ).map((flv) => (
                      <option key={flv} value={flv}>{flv}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Size / Portion Option *</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  >
                    {currentProduct.priceOptions.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label} — Rs. {opt.amountPKR.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Required Delivery Date *</label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                  />
                  <span className="text-[10px] text-[#8A6428]">Minimum 1 day ahead for simple, 2-3 days for custom</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#3A2117]">Quantity</label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-[#FFF8ED] border border-[#DFCBB6] font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm text-[#3A2117] w-6 text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-[#FFF8ED] border border-[#DFCBB6] font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3A2117]">Lettering on Cake & Special Notes</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Please write 'Happy 21st Birthday Ayesha' in gold lettering with extra candles..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                />
              </div>
            </div>

            {/* Step 3: Payment & Proof */}
            <div className="space-y-4 pt-4 border-t border-[#DFCBB6]/50">
              <h2 className="font-serif text-lg font-bold text-[#3A2117] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C59A5B] text-[#3A2117] text-xs flex items-center justify-center font-bold">3</span>
                <span>100% Advance Payment (Easypaisa / JazzCash)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Easypaisa')}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                    paymentMethod === 'Easypaisa'
                      ? 'border-[#148447] bg-emerald-50/50 ring-1 ring-[#148447]'
                      : 'border-[#DFCBB6] bg-[#FFF8ED]/40 hover:bg-[#FFF8ED]'
                  }`}
                >
                  <p className="text-xs font-bold text-[#148447]">Easypaisa</p>
                  <p className="font-serif text-lg font-black text-[#3A2117]">{EASYPAISA_NUMBER}</p>
                  <p className="text-[11px] text-[#75645A]">Title: Sweet Pearl Bakes</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-4 rounded-xl border text-left space-y-1 transition-all ${
                    paymentMethod === 'JazzCash'
                      ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                      : 'border-[#DFCBB6] bg-[#FFF8ED]/40 hover:bg-[#FFF8ED]'
                  }`}
                >
                  <p className="text-xs font-bold text-amber-700">JazzCash</p>
                  <p className="font-serif text-lg font-black text-[#3A2117]">{JAZZCASH_NUMBER}</p>
                  <p className="text-[11px] text-[#75645A]">Title: Sweet Pearl Bakes</p>
                </button>
              </div>

              {/* Upload Screenshot */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#3A2117] block">
                  Upload Payment Screenshot Proof *
                </label>
                <div className="border-2 border-dashed border-[#DFCBB6] rounded-20px p-5 text-center bg-[#FFF8ED]/50 relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleProofUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {proofDataUrl ? (
                    <div className="space-y-2">
                      <img src={proofDataUrl} alt="Payment proof preview" className="w-24 h-24 object-cover mx-auto rounded-lg shadow-sm" />
                      <p className="text-xs text-[#148447] font-semibold">Screenshot attached! Click to replace.</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-[#C59A5B] mx-auto" />
                      <p className="text-xs font-semibold text-[#3A2117]">Attach Easypaisa / JazzCash receipt</p>
                      <p className="text-[10px] text-[#75645A]">PNG, JPG up to 5 MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Total Summary & Submit */}
            <div className="pt-6 border-t border-[#DFCBB6]/50 space-y-4">
              <div className="bg-[#FFF8ED] p-4 rounded-xl border border-[#DFCBB6] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#75645A]">Total Advance Amount to Pay</p>
                  <p className="font-serif text-2xl font-black text-[#3A2117]">
                    Rs. {grandTotal.toLocaleString()}
                  </p>
                </div>
                <div className="text-right text-xs text-[#8A6428]">
                  <p className="font-semibold">{quantity}x {currentProduct.name}</p>
                  <p className="text-[11px]">{selectedSize}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-black py-4 rounded-full text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#3A2117] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Confirm & Schedule Order (Rs. {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
