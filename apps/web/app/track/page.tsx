'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Clock, CheckCircle2, Package, Truck, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';
import { trackOrderApi } from '@/lib/api';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams?.get('order') || '');
  const [phone, setPhone] = useState(searchParams?.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  const statusSteps = [
    { key: 'Received', label: 'Order Received' },
    { key: 'Payment Verified', label: 'Payment Verified' },
    { key: 'Preparing', label: 'Baking & Decorating' },
    { key: 'Ready', label: 'Packed & Ready' },
    { key: 'Out for Delivery', label: 'Out for Delivery' },
    { key: 'Delivered', label: 'Delivered' },
  ];

  useEffect(() => {
    if (searchParams?.get('order') && searchParams?.get('phone')) {
      handleTrack(undefined, searchParams.get('order')!, searchParams.get('phone')!);
    }
  }, [searchParams]);

  const handleTrack = async (e?: React.FormEvent, directOrder?: string, directPhone?: string) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setOrderData(null);

    const num = directOrder || orderNumber;
    const ph = directPhone || phone;

    if (!num || !ph) {
      setErrorMsg('Please enter both your Order ID (e.g. SPB-1001) and your Phone Number.');
      return;
    }

    try {
      setLoading(true);
      const data = await trackOrderApi(num, ph);
      setOrderData(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'No matching order found. Please verify your order number and phone.');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['Received', 'Payment Verified', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === 'Cancelled') return 'cancelled';
    if (stepIndex <= currentIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Live Cake Tracking</span>
        <h1 className="font-serif text-4xl font-bold text-[#3A2117]">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-[#75645A]">
          Enter your Order Number and phone number to check current baking and delivery progress in Dera Ismail Khan.
        </p>
      </div>

      {/* Tracking Form */}
      <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] max-w-xl mx-auto">
        <form onSubmit={(e) => handleTrack(e)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3A2117]">Order ID (e.g. SPB-1001) *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="SPB-1001"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B] uppercase font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3A2117]">Phone Number Provided at Checkout *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0330 1234567"
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
            />
            <span className="text-[10px] text-[#75645A]">Required to protect order privacy</span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold py-3 rounded-full text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#3A2117] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Lookup Order Status</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tracking Result */}
      {orderData && (
        <div className="bg-white rounded-20px p-6 sm:p-8 shadow-cocoa-lg border border-[#DFCBB6] space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFCBB6]/50 pb-6">
            <div>
              <span className="text-xs font-bold text-[#8A6428]">Order Lookup Details</span>
              <h2 className="font-serif text-2xl font-bold text-[#3A2117]">Order #{orderData.orderNumber}</h2>
              <p className="text-xs text-[#75645A]">Scheduled for delivery on {orderData.deliveryDate}</p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF8ED] border border-[#C59A5B] text-xs font-bold text-[#3A2117]">
              <span className="w-2 h-2 rounded-full bg-[#148447] animate-pulse" />
              <span>Status: {orderData.status}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#3A2117]">Order Timeline</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {statusSteps.map((step, idx) => {
                const state = getStepStatus(step.key, orderData.status);
                return (
                  <div
                    key={step.key}
                    className={`p-3.5 rounded-xl border text-center space-y-1.5 transition-all ${
                      state === 'completed'
                        ? 'bg-emerald-50 border-emerald-200 text-[#148447]'
                        : 'bg-[#FFF8ED]/40 border-[#DFCBB6]/60 text-[#75645A]'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full mx-auto flex items-center justify-center text-xs font-bold bg-white border">
                      {state === 'completed' ? '✓' : idx + 1}
                    </div>
                    <p className="text-xs font-bold text-[#3A2117]">{step.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary (Private Address Excluded) */}
          <div className="bg-[#FFF8ED] p-4 rounded-xl border border-[#DFCBB6] space-y-3">
            <h4 className="font-bold text-xs text-[#3A2117] uppercase">Ordered Items</h4>
            <div className="space-y-2">
              {orderData.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-xs text-[#33241E] pb-1 border-b border-[#DFCBB6]/40">
                  <div>
                    <span className="font-bold">{item.quantity}x {item.productName}</span>
                    <span className="text-[#75645A] block text-[11px]">{item.flavor} • {item.sizeLabel}</span>
                  </div>
                  <span className="text-emerald-700 font-semibold text-[11px]">In Production</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#75645A]">
              Need to make a quick adjustment? Contact us on WhatsApp with your Order ID.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
