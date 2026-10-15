'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Upload, MessageCircle, ShoppingBag, Clock, Heart, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/constants';

export default function CustomCakesPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    weight: '2 lbs (Serves 8-12)',
    flavor: 'Chocolate Ganache',
    themeNotes: '',
    photoDataUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const sampleDesigns = [
    {
      title: 'Gold Floral Anniversary & Nikkah Cake',
      desc: 'Pastel and gold leaf finish with delicate sugar florals and custom acrylic topper.',
      image: '/products/gold-floral-anniversary-cake.jpg'
    },
    {
      title: 'Fairy Butterfly Wings Theme Cake',
      desc: 'Enchanting pastel ombre cake topped with illuminated fairy wings and delicate butterflies.',
      image: '/products/fairy-butterfly-wings-cake.jpg'
    },
    {
      title: 'Kids Fantasy 3D Character Cake',
      desc: 'Handcrafted teddy bear illustrations, rosette wool piping, and custom birthday greetings.',
      image: '/products/cute-teddy-bear-cake.jpg'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Please choose an image under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setFormData({ ...formData, photoDataUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      product: 'Bespoke Custom Event & Birthday Cake',
      slug: 'bespoke-custom-cake',
      flavor: formData.flavor,
      size: formData.weight,
      date: formData.date,
      instructions: `Theme: ${formData.themeNotes}`,
      name: formData.name,
      phone: formData.phone
    });
    router.push(`/order?${query.toString()}`);
  };

  const handleWhatsAppQuote = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Sweet Pearl Bakes! I would like a custom quote for a themed cake in Dera Ismail Khan.\n\nName: ${formData.name || 'Customer'}\nPhone: ${formData.phone || 'N/A'}\nEvent Date: ${formData.date || 'TBD'}\nEstimated Size: ${formData.weight}\nFlavor: ${formData.flavor}\nTheme Ideas: ${formData.themeNotes || 'Reference photo ready to share'}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8A6428]">Bespoke Confectionery</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#3A2117]">
          Custom & Theme Cakes
        </h1>
        <p className="text-sm text-[#75645A] leading-relaxed">
          From multi-tiered wedding cakes to themed birthday centerpieces, we bring your sweet visions to reality in Dera Ismail Khan. Custom orders require 2–3 days advance notice.
        </p>
      </div>

      {/* 3-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-20px border border-[#DFCBB6] shadow-cocoa space-y-2">
          <span className="text-xs font-bold text-[#C59A5B] uppercase tracking-wider">Step 1</span>
          <h3 className="font-serif text-lg font-bold text-[#3A2117]">Share Your Inspiration</h3>
          <p className="text-xs text-[#75645A] leading-relaxed">
            Upload your reference picture from Instagram, Pinterest, or sketch your dream theme with custom colors.
          </p>
        </div>

        <div className="bg-white p-6 rounded-20px border border-[#DFCBB6] shadow-cocoa space-y-2">
          <span className="text-xs font-bold text-[#C59A5B] uppercase tracking-wider">Step 2</span>
          <h3 className="font-serif text-lg font-bold text-[#3A2117]">Quotation & Advance</h3>
          <p className="text-xs text-[#75645A] leading-relaxed">
            We confirm the feasibility, provide an accurate PKR quotation based on complexity, and lock the date with advance payment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-20px border border-[#DFCBB6] shadow-cocoa space-y-2">
          <span className="text-xs font-bold text-[#C59A5B] uppercase tracking-wider">Step 3</span>
          <h3 className="font-serif text-lg font-bold text-[#3A2117]">Artisan Baking & Delivery</h3>
          <p className="text-xs text-[#75645A] leading-relaxed">
            Baked fresh with top-tier Belgian chocolate and dairy butter, then safely dispatched to your DI Khan celebration.
          </p>
        </div>
      </div>

      {/* Gallery Showcase */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#3A2117] text-center">
          Featured Custom Creations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleDesigns.map((item, idx) => (
            <div key={idx} className="bg-white rounded-20px overflow-hidden border border-[#DFCBB6] shadow-cocoa group">
              <div className="h-64 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="font-serif text-lg font-bold text-[#3A2117]">{item.title}</h3>
                <p className="text-xs text-[#75645A]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Quote Form */}
      <div className="bg-white rounded-20px p-6 sm:p-10 shadow-cocoa-lg border border-[#DFCBB6] max-w-3xl mx-auto space-y-8">
        <div className="border-b border-[#DFCBB6]/50 pb-4 space-y-1">
          <h2 className="font-serif text-2xl font-bold text-[#3A2117]">Request a Custom Cake Quotation</h2>
          <p className="text-xs text-[#75645A]">Fill in your event details below to proceed directly to our order builder or consult via WhatsApp.</p>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Fatima Ali"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Phone Number (for WhatsApp verification) *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 0330 1234567"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Required Delivery Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
              <span className="text-[10px] text-[#8A6428]">Min. 2-3 days notice</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Estimated Weight / Size</label>
              <select
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              >
                <option value="2 lbs (Serves 8-12)">2 lbs (Serves 8-12)</option>
                <option value="3 lbs (Serves 14-18)">3 lbs (Serves 14-18)</option>
                <option value="4 lbs 2-Tier (Serves 20-25)">4 lbs 2-Tier (Serves 20-25)</option>
                <option value="5+ lbs Grand Event">5+ lbs Grand Event</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#3A2117]">Preferred Flavor</label>
              <select
                value={formData.flavor}
                onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              >
                <option value="Chocolate Ganache">Chocolate Ganache</option>
                <option value="Red Velvet">Red Velvet</option>
                <option value="Vanilla Bean">Vanilla Bean</option>
                <option value="Lotus Biscoff">Lotus Biscoff</option>
                <option value="Black Forest">Black Forest</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3A2117]">Theme Concept, Colors & Cake Lettering</label>
            <textarea
              rows={3}
              value={formData.themeNotes}
              onChange={(e) => setFormData({ ...formData, themeNotes: e.target.value })}
              placeholder="e.g. Vintage pastel piping in baby pink and gold leaf with 'Happy 25th Hira' written on top..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
            />
          </div>

          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#3A2117] block">Upload Reference Photo (Optional)</label>
            <div className="border-2 border-dashed border-[#DFCBB6] rounded-20px p-6 text-center bg-[#FFF8ED]/50 hover:bg-[#FFF8ED] transition-colors relative">
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Design preview" className="w-32 h-32 object-cover mx-auto rounded-xl shadow-sm" />
                  <p className="text-xs text-[#148447] font-semibold">Reference photo selected! Click to change.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-[#C59A5B] mx-auto" />
                  <p className="text-xs font-semibold text-[#3A2117]">Drop or browse reference cake picture</p>
                  <p className="text-[10px] text-[#75645A]">PNG, JPG, or WebP up to 5 MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold py-3.5 px-6 rounded-full text-xs shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue to Online Order</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppQuote}
              className="w-full sm:w-auto bg-[#148447] hover:bg-[#116e3a] text-white font-semibold py-3.5 px-6 rounded-full text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Discuss on WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
