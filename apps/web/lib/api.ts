import { DEFAULT_PRODUCTS, EASYPAISA_NUMBER, JAZZCASH_NUMBER, OPERATING_HOURS, WHATSAPP_NUMBER } from './constants';
import { IProduct, IOrder, ISettings } from '@sweetpearl/shared';

const API_BASE = '/api/v1';

export async function fetchProducts(category?: string, search?: string): Promise<IProduct[]> {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return json.data || DEFAULT_PRODUCTS;
  } catch (err) {
    console.warn('API unavailable, using fallback products data', err);
    let items = [...DEFAULT_PRODUCTS];
    if (category && category !== 'All') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    }
    return items;
  }
}

export async function fetchProductBySlug(slug: string): Promise<IProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Product not found');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return DEFAULT_PRODUCTS.find(p => p.slug === slug) || null;
  }
}

export async function fetchSettings(): Promise<ISettings> {
  try {
    const res = await fetch(`${API_BASE}/settings/public`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return json.data;
  } catch (err) {
    return {
      businessHours: OPERATING_HOURS,
      deliveryNote: 'Delivery available exclusively within Dera Ismail Khan. Delivery fee quoted upon confirmation.',
      announcementText: '✨ Simple cakes: 1 day notice • Custom cakes: 2–3 days notice ✨',
      whatsappNumber: WHATSAPP_NUMBER,
      minNoticeDaysSimple: 1,
      minNoticeDaysCustom: 2,
      paymentAccounts: [
        {
          method: 'Easypaisa',
          number: EASYPAISA_NUMBER,
          title: 'Sweet Pearl Bakes (Easypaisa)',
          instructions: 'Send 100% advance payment to 0316-9403356 & upload screenshot.'
        },
        {
          method: 'JazzCash',
          number: JAZZCASH_NUMBER,
          title: 'Sweet Pearl Bakes (JazzCash)',
          instructions: 'Send 100% advance payment to 0330-6363356 & upload screenshot.'
        }
      ]
    };
  }
}

export async function submitOrder(orderData: any) {
  // Validate required advance payment information
  if (!orderData.paymentMethod || !['Easypaisa', 'JazzCash'].includes(orderData.paymentMethod)) {
    throw new Error('Please select a payment method and pay the required advance payment before confirming your order.');
  }

  if (!orderData.paymentProofUrl || typeof orderData.paymentProofUrl !== 'string' || !orderData.paymentProofUrl.trim()) {
    throw new Error('Please upload your advance payment receipt before confirming your order.');
  }

  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to submit order');
    }
    return json;
  }

  const text = await res.text();
  console.warn('API returned non-JSON response:', text.slice(0, 100));
  throw new Error('API server returned an unexpected response. Please try again.');
}

export async function trackOrderApi(orderNumber: string, phone: string) {
  try {
    const res = await fetch(`${API_BASE}/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, phone }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Order not found');
      }
      return json.data;
    }
  } catch (err: any) {
    console.warn('API error during tracking, checking client fallback:', err);
  }

  // Check localStorage fallback for orders placed in current session
  if (typeof window !== 'undefined') {
    try {
      const stored = JSON.parse(localStorage.getItem('spb_orders') || '[]');
      const cleanInputPhone = phone.replace(/[^0-9]/g, '');
      const cleanOrderNumber = orderNumber.trim().toUpperCase();
      const found = stored.find((o: any) => {
        const matchNum = o.orderNumber?.toUpperCase() === cleanOrderNumber;
        const cleanOrderPhone = (o.customer?.phone || '').replace(/[^0-9]/g, '');
        const matchPhone = !cleanInputPhone || cleanOrderPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanOrderPhone);
        return matchNum && matchPhone;
      });
      if (found) return found;
    } catch (e) {
      // ignore
    }
  }

  throw new Error('No matching order found. Please verify your order number and phone.');
}

export async function submitContactMessage(msgData: any) {
  try {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to send message');
      return json;
    }
  } catch (err: any) {
    console.warn('API error during submitContactMessage, fallback:', err);
  }
  return { success: true, message: 'Message received! We will contact you soon.' };
}

export async function submitNewsletter(email: string) {
  try {
    const res = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to subscribe');
      return json;
    }
  } catch (err: any) {
    console.warn('API error during submitNewsletter, fallback:', err);
  }
  return { success: true, message: 'Subscribed successfully!' };
}

