import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const validEmail = (process.env.ADMIN_EMAIL || 'admin@sweetpearlbakes.com').toLowerCase();
    const validPassword = process.env.ADMIN_PASSWORD || 'sweetpearl123';

    if (
      email &&
      password &&
      email.trim().toLowerCase() === validEmail &&
      password === validPassword
    ) {
      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          email: validEmail,
          role: 'admin',
          authenticatedAt: new Date().toISOString(),
        },
      });

      // Set auth cookie for server-side middleware verification
      response.cookies.set('spb_admin_token', 'spb_admin_session_token_valid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid email or password. Access denied.',
      },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Login request failed',
      },
      { status: 500 }
    );
  }
}
