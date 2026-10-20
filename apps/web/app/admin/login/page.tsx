'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Cake, AlertCircle, ArrowRight } from 'lucide-react';
import { SITE_NAME } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      let json: any = {};
      if (contentType.includes('application/json')) {
        json = await res.json();
      }

      if (!res.ok) {
        throw new Error(json.message || 'Invalid credentials. Access denied.');
      }

      // Store in localStorage as client session indicator
      localStorage.setItem('spb_admin_session', JSON.stringify(json.data || { email, role: 'admin' }));
      router.replace('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#3A2117] text-[#C59A5B] flex items-center justify-center mx-auto shadow-sm">
          <Cake className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3A2117]">Staff Portal Login</h1>
        <p className="text-xs text-[#75645A]">Restricted administrator access for Sweet Pearl Bakes</p>
      </div>

      <div className="bg-white p-8 rounded-20px shadow-cocoa-lg border border-[#DFCBB6] space-y-6">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3A2117]">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#75645A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@sweetpearlbakes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#3A2117]">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#75645A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C59A5B] hover:bg-[#b08749] text-[#3A2117] font-bold py-3.5 rounded-full text-xs shadow-sm transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#3A2117] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
