import { NextResponse } from 'next/server';
import { DEFAULT_PRODUCTS } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Forward to backend if configured
    const apiTarget = (process.env.API_URL || '').replace(/\/$/, '');
    if (apiTarget) {
      try {
        const backendRes = await fetch(`${apiTarget}/api/v1/products?${searchParams.toString()}`);
        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        // Fallback to static catalog
      }
    }

    let items = [...DEFAULT_PRODUCTS];
    if (category && category !== 'All') {
      items = items.filter(
        (i) => i.category.toLowerCase() === category.toLowerCase()
      );
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
