'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Users,
  Settings,
  LogOut,
  Eye,
  Check,
  X,
  ExternalLink,
  MessageCircle,
  Search
} from 'lucide-react';
import { IOrder, IProduct, IContactMessage, ISubscriber, ISettings } from '@sweetpearl/shared';
import { DEFAULT_PRODUCTS } from '@/lib/constants';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'messages' | 'subscribers' | 'settings'>('orders');

  const [stats, setStats] = useState<any>({
    totalOrders: 1,
    pendingOrders: 0,
    activeOrders: 1,
    completedOrders: 0,
    totalRevenuePKR: 3400,
    ordersToday: 1,
    activeProducts: 6,
    totalSubscribers: 1,
    newMessages: 1,
  });

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>(DEFAULT_PRODUCTS);
  const [messages, setMessages] = useState<IContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<ISubscriber[]>([]);
  const [settingsData, setSettingsData] = useState<any>(null);

  const [selectedOrderProof, setSelectedOrderProof] = useState<any>(null);
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const localSession = typeof window !== 'undefined' ? localStorage.getItem('spb_admin_session') : null;
      if (!localSession) {
        router.replace('/admin/login');
        return;
      }

      try {
        const res = await fetch('/api/v1/auth/verify');
        if (!res.ok) {
          localStorage.removeItem('spb_admin_session');
          router.replace('/admin/login');
          return;
        }
      } catch (err) {
        // Offline or serverless fallback
      }

      setIsAuthenticated(true);
      loadAllData();
    };

    checkAuth();
  }, [router]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await fetch('/api/v1/admin/stats');
      if (statsRes.ok) {
        const json = await statsRes.json();
        setStats(json.data);
      }

      // Fetch orders
      const ordRes = await fetch('/api/v1/admin/orders');
      if (ordRes.ok) {
        const json = await ordRes.json();
        setOrders(json.data);
      }

      // Fetch products
      const prodRes = await fetch('/api/v1/admin/products');
      if (prodRes.ok) {
        const json = await prodRes.json();
        setProducts(json.data);
      }

      // Fetch messages
      const msgRes = await fetch('/api/v1/admin/messages');
      if (msgRes.ok) {
        const json = await msgRes.json();
        setMessages(json.data);
      }

      // Fetch subscribers
      const subRes = await fetch('/api/v1/admin/subscribers');
      if (subRes.ok) {
        const json = await subRes.json();
        setSubscribers(json.data);
      }

      // Fetch settings
      const setRes = await fetch('/api/v1/settings/public');
      if (setRes.ok) {
        const json = await setRes.json();
        setSettingsData(json.data);
      }

      // Merge client orders for standalone visibility
      if (typeof window !== 'undefined') {
        try {
          const localOrders = JSON.parse(localStorage.getItem('spb_orders') || '[]');
          if (localOrders.length > 0) {
            setOrders((prev) => {
              const ids = new Set(prev.map((o) => o.orderNumber));
              const newOrders = localOrders.filter((o: any) => !ids.has(o.orderNumber));
              return [...newOrders, ...prev];
            });
          }
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Using local store fallback in admin', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionSuccess(`Order updated to ${newStatus}`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllData();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleVerifyPayment = async (orderId: string, status: 'Verified' | 'Rejected') => {
    try {
      const res = await fetch(`/api/v1/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSelectedOrderProof(null);
        setActionSuccess(`Payment marked as ${status}`);
        setTimeout(() => setActionSuccess(''), 3000);
        loadAllData();
      }
    } catch (err) {
      alert('Failed to update payment');
    }
  };

  const handleExportCsv = () => {
    window.open('/api/v1/admin/export/orders.csv', '_blank');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('spb_admin_session');
    router.replace('/admin/login');
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderFilter === 'All' || o.status === orderFilter;
    const matchQuery =
      !orderSearch ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchStatus && matchQuery;
  });

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#C59A5B] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[#75645A]">Verifying administrator credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DFCBB6] pb-6">
        <div>
          <span className="text-xs font-bold text-[#8A6428] uppercase tracking-wider">Sweet Pearl Bakes</span>
          <h1 className="font-serif text-3xl font-bold text-[#3A2117]">Owner Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="bg-white hover:bg-[#FFF8ED] text-[#3A2117] text-xs font-bold px-4 py-2.5 rounded-full border border-[#DFCBB6] shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2.5 rounded-full border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[#148447] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-1">
          <span className="text-[11px] font-semibold text-[#75645A] uppercase">Total Revenue (PKR)</span>
          <p className="font-serif text-2xl font-black text-[#3A2117]">
            Rs. {stats.totalRevenuePKR?.toLocaleString()}
          </p>
          <span className="text-[10px] text-[#148447] font-semibold">Verified Orders</span>
        </div>

        <div className="bg-white p-5 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-1">
          <span className="text-[11px] font-semibold text-[#75645A] uppercase">Orders Today</span>
          <p className="font-serif text-2xl font-black text-[#3A2117]">{stats.ordersToday || 0}</p>
          <span className="text-[10px] text-[#8A6428] font-semibold">Scheduled in DI Khan</span>
        </div>

        <div className="bg-white p-5 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-1">
          <span className="text-[11px] font-semibold text-[#75645A] uppercase">Active In-Flight</span>
          <p className="font-serif text-2xl font-black text-amber-700">{stats.activeOrders || 0}</p>
          <span className="text-[10px] text-amber-600 font-semibold">Preparing / Ready</span>
        </div>

        <div className="bg-white p-5 rounded-20px shadow-cocoa border border-[#DFCBB6] space-y-1">
          <span className="text-[11px] font-semibold text-[#75645A] uppercase">New Inquiries</span>
          <p className="font-serif text-2xl font-black text-[#148447]">{stats.newMessages || 0}</p>
          <span className="text-[10px] text-[#75645A] font-semibold">{stats.totalSubscribers} Subscribers</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#DFCBB6] gap-2 overflow-x-auto pb-1">
        {[
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'products', label: `Products (${products.length})`, icon: FileText },
          { key: 'messages', label: `Inquiries (${messages.length})`, icon: Mail },
          { key: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
                activeTab === tab.key
                  ? 'bg-white text-[#3A2117] border-[#DFCBB6] shadow-sm -mb-px'
                  : 'bg-[#FFF8ED] text-[#75645A] border-transparent hover:bg-[#F2E2D0]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C59A5B]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-20px p-6 shadow-cocoa border border-[#DFCBB6] space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {['All', 'Received', 'Payment Verified', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                      orderFilter === st
                        ? 'bg-[#3A2117] text-[#FFF8ED]'
                        : 'bg-[#FFF8ED] text-[#33241E] border border-[#DFCBB6]'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#75645A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search order #, customer, phone..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-[#FFF8ED] text-xs text-[#33241E] border border-[#DFCBB6] focus:outline-none"
              />
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-[#75645A] text-xs">No orders matching filter.</div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order._id || order.orderNumber}
                  className="bg-[#FFF8ED]/40 rounded-xl p-5 border border-[#DFCBB6] space-y-4 hover:border-[#C59A5B] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DFCBB6]/50 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-black text-[#3A2117]">{order.orderNumber}</span>
                      <span className="text-xs text-[#75645A]">📅 Deliver: <strong>{order.deliveryDate}</strong></span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          order.payment.status === 'Verified'
                            ? 'bg-emerald-100 text-[#148447]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Payment: {order.payment.method} ({order.payment.status})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.payment.proofUrl && (
                        <button
                          onClick={() => setSelectedOrderProof(order)}
                          className="bg-white hover:bg-[#FFF8ED] text-[#8A6428] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#DFCBB6] flex items-center gap-1 shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Proof Screenshot</span>
                        </button>
                      )}

                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id || order.orderNumber, e.target.value)}
                        className="bg-white text-xs font-bold text-[#3A2117] px-3 py-1.5 rounded-full border border-[#DFCBB6] focus:outline-none focus:border-[#C59A5B]"
                      >
                        <option value="Received">Received</option>
                        <option value="Payment Verified">Payment Verified</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-[#3A2117]">{order.customer.name}</p>
                      <p className="text-[#75645A]">📞 {order.customer.phone}</p>
                      <p className="text-[#75645A]">📍 {order.deliveryAddress}</p>
                    </div>

                    <div>
                      <p className="font-bold text-[#3A2117]">Ordered Items:</p>
                      {order.items.map((it, idx) => (
                        <p key={idx} className="text-[#75645A]">
                          {it.quantity}x {it.productName} ({it.flavor} • {it.sizeLabel})
                        </p>
                      ))}
                      {order.instructions && (
                        <p className="text-[#8A6428] mt-1 italic">"{order.instructions}"</p>
                      )}
                    </div>

                    <div className="sm:text-right space-y-1">
                      <p className="text-xs text-[#75645A]">Total Amount</p>
                      <p className="font-serif text-xl font-black text-[#3A2117]">Rs. {order.totalPKR?.toLocaleString()}</p>
                      <a
                        href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Assalam-o-Alaikum ${order.customer.name}! Updating you regarding your Sweet Pearl Bakes order #${order.orderNumber}. Status: ${order.status}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#148447] font-semibold hover:underline"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Message Customer</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-20px p-6 shadow-cocoa border border-[#DFCBB6] space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-xl font-bold text-[#3A2117]">Bakery Menu Items ({products.length})</h2>
            <span className="text-xs text-[#75645A]">Products sync with public catalog</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod._id || prod.slug} className="bg-[#FFF8ED]/40 p-4 rounded-xl border border-[#DFCBB6] space-y-3">
                <div className="h-40 w-full rounded-lg overflow-hidden relative">
                  <img src={prod.images[0]?.url} alt={prod.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#3A2117] text-[#FFF8ED] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {prod.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#3A2117]">{prod.name}</h3>
                  <p className="text-xs text-[#75645A] line-clamp-2">{prod.description}</p>
                </div>
                <div className="text-xs font-semibold text-[#8A6428]">
                  {prod.priceOptions.map((opt) => `${opt.label}: Rs. ${opt.amountPKR}`).join(' | ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MESSAGES */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-20px p-6 shadow-cocoa border border-[#DFCBB6] space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#3A2117]">Customer Inquiries ({messages.length})</h2>
          {messages.length === 0 ? (
            <p className="text-xs text-[#75645A]">No messages received yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className="p-4 rounded-xl bg-[#FFF8ED]/40 border border-[#DFCBB6] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#3A2117]">{msg.name} ({msg.phone || msg.email || 'No contact info'})</span>
                    <span className="text-[10px] text-[#75645A]">{new Date(msg.createdAt!).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-[#33241E] leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUBSCRIBERS */}
      {activeTab === 'subscribers' && (
        <div className="bg-white rounded-20px p-6 shadow-cocoa border border-[#DFCBB6] space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#3A2117]">Newsletter Subscribers ({subscribers.length})</h2>
          <div className="divide-y divide-[#DFCBB6]/50">
            {subscribers.map((sub) => (
              <div key={sub._id} className="py-2.5 flex justify-between items-center text-xs text-[#33241E]">
                <span>{sub.email}</span>
                <span className="text-[10px] text-[#75645A]">{new Date(sub.subscribedAt!).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {selectedOrderProof && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-20px max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#DFCBB6]">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-[#3A2117]">
                Payment Proof Screenshot: Order #{selectedOrderProof.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrderProof(null)} className="text-sm font-bold">✕</button>
            </div>

            <div className="h-80 w-full rounded-xl overflow-hidden bg-black/5 border border-[#DFCBB6]">
              <img src={selectedOrderProof.payment.proofUrl} alt="Proof" className="w-full h-full object-contain" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleVerifyPayment(selectedOrderProof._id || selectedOrderProof.orderNumber, 'Rejected')}
                className="bg-rose-50 text-rose-700 font-bold px-4 py-2 rounded-full text-xs border border-rose-200"
              >
                Reject Payment
              </button>
              <button
                onClick={() => handleVerifyPayment(selectedOrderProof._id || selectedOrderProof.orderNumber, 'Verified')}
                className="bg-[#148447] text-white font-bold px-6 py-2 rounded-full text-xs shadow-sm"
              >
                Approve & Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
