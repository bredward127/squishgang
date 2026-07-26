import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone } = body;
    
    await db.collection('leads').add({
      name: name || '',
      email,
      phone: phone || '',
      createdAt: new Date(),
      source: 'website'
    });

    console.log('--- NEW CONTACT CAPTURED AND SAVED ---');
    console.log(`Email: ${email}`);
    
    return NextResponse.json({ success: true, message: 'Contact captured successfully.' });
  } catch (error) {
    console.error('Error saving contact:', error);
    return NextResponse.json({ success: false, error: 'Failed to capture contact.' }, { status: 500 });
  }
}
