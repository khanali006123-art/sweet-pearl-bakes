import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully to Sweet Pearl Bakes newsletter!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Failed to subscribe' },
      { status: 400 }
    );
  }
}
