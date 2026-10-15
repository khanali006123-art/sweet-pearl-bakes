'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, Send, CheckCircle2, AlertCircle, Cake } from 'lucide-react';
import { SITE_NAME, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, OPERATING_HOURS, LOCATION } from '@/lib/constants';
import { submitContactMessage } from '@/lib/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setStatus('error');
      setFeedback('Please provide your name and message.');
      return;
    }

    try {
      setStatus('loading');
      await submitContactMessage(formData);
      setStatus('success');
      setFeedback('Thank you! Your message has been sent to Sweet Pearl Bakes. We will reply shortly.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setFeedback(err.message || 'Failed to send message. Please try again or message via WhatsApp.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Get in Touch</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Contact Sweet Pearl Bakes
        </h1>
        <p className="text-xs sm:text-sm text-[#75645A]">
          Have a question about a celebration cake, corporate order, or delivery in DI Khan? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#3A2117]">Bakery Studio Info</h2>

            <div className="space-y-4 text-xs sm:text-sm text-[#33241E]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C59A5B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#3A2117]">Location</p>
                  <p className="text-[#75645A]">{LOCATION}</p>
                  <p className="text-[11px] text-[#8A6428]">Home Kitchen Studio (Deliveries across DI Khan)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#C59A5B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#3A2117]">Daily Operating Hours</p>
                  <p className="text-[#75645A]">{OPERATING_HOURS}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#C59A5B] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#3A2117]">Direct Phone & WhatsApp</p>
                  <p className="text-[#75645A]">{WHATSAPP_DISPLAY}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#DFCBB6]/50">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#148447] hover:bg-[#116e3a] text-white font-bold py-3.5 px-6 rounded-full text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-[#3A2117]">Send Us a Message</h2>
            <p className="text-xs text-[#75645A]">We respond within a few hours during operating hours.</p>
          </div>

          {status === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-[#148447] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3A2117]">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Zainab Malik"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#3A2117]">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0330 1234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Email Address (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. zainab@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Your Message or Inquiry *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="How can we help make your celebration sweeter? Ask about custom flavors, bulk event pricing, or dates..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold py-3.5 px-8 rounded-full text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {status === 'loading' ? (
                <span>Sending Message...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
