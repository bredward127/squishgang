'use client';

import { useCart } from '@/components/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useState } from 'react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">Order Confirmed! 🎉</h1>
          <p className="text-lg text-gray-600 mb-2">Thank you for your purchase.</p>
          <p className="text-sm text-gray-500 mb-8">Order ID: {orderId}</p>
          <Link href="/" className="inline-block px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-32 h-32 mb-8 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any squishies yet.</p>
        <Link href="/" className="px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-1 w-full bg-slate-50">
      <h1 className="text-4xl font-black text-slate-800 mb-10">Shopping Box</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-28 aspect-square rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                <Image src={item.image} alt={item.title} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-700 text-lg mb-1 line-clamp-2">{item.title}</h3>
                  <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:text-pink-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-bold text-slate-700">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 hover:text-pink-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-black text-xl text-blue-600 italic">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-lg hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 sticky top-28 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Order Summary</h2>
            <div className="space-y-4 mb-6 text-sm font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-indigo-600 font-bold">Free via AliExpress</span>
              </div>
              <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                <span className="font-black text-slate-800 text-lg uppercase">Total</span>
                <span className="font-black text-3xl text-blue-600 italic">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-8 z-0 relative">
              <PayPalButtons
                style={{ layout: "vertical", shape: "rect", color: "gold" }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: total.toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order?.capture();
                  
                  // Notify our backend API to process AliExpress order
                  try {
                    await fetch('/api/checkout', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        amount: total.toFixed(2),
                        items: items
                      })
                    });
                  } catch (e) {
                    console.error("Failed to notify backend", e);
                  }

                  clearCart();
                  setOrderId(data.orderID);
                  setOrderComplete(true);
                }}
                onError={(err) => {
                  console.error("PayPal Error:", err);
                  alert("There was an error processing your payment. Please try again.");
                }}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure Checkout via PayPal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
