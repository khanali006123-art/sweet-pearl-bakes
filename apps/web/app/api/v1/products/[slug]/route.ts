import { NextResponse } from 'next/server';
import { DEFAULT_PRODUCTS } from '@/lib/constants';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Forward to backend if configured
    const apiTarget = (process.env.API_URL || '').replace(/\/$/, '');
    if (apiTarget) {
      try {
        const backendRes = await fetch(`${apiTarget}/api/v1/products/${slug}`);
        if (backendRes.ok) {
          const data = await backendRes.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        // Fallback
      }
    }

    const product = DEFAULT_PRODUCTS.find((p) => p.slug === slug);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
