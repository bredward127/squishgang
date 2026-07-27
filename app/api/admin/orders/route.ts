import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.replace('Bearer ', '');
    const decoded = await getAuth().verifyIdToken(idToken);
    const ALLOWED_ADMIN_EMAILS = ['edjones0127@gmail.com', '3ddi300@gmail.com'];
    if (!decoded.email || !ALLOWED_ADMIN_EMAILS.includes(decoded.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
