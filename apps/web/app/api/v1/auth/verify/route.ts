import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('spb_admin_token')?.value;

  if (token) {
    return NextResponse.json({
      success: true,
      authenticated: true,
    });
  }

  return NextResponse.json(
    {
      success: false,
      authenticated: false,
      message: 'Not authenticated',
    },
    { status: 401 }
  );
}
