import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderID, items, amount } = body;

    await db.collection('orders').add({
      orderID,
      amount,
      items,
      status: 'received',
      createdAt: new Date().toISOString(),
    });

    console.log('--- NEW ORDER SAVED ---');
    console.log(`Order ID (PayPal): ${orderID}`);
    console.log(`Total Amount: $${amount}`);

    return NextResponse.json({ success: true, message: 'Order processed and saved.' });
  } catch (error) {
    console.error('Failed to save order:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order.' }, { status: 500 });
  }
}
