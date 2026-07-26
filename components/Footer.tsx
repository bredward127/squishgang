'use client';

import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus('submitting');
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-indigo-900 md:h-[120px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="max-w-md text-center md:text-left">
        <h3 className="text-white font-black text-xl mb-1">Join the Squishy VIP Club</h3>
        <p className="text-indigo-300 text-sm">Get 15% off your first sensory bundle and tracking updates.</p>
      </div>
      <div className="flex gap-2 flex-1 max-w-sm w-full mx-0 md:mx-8">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting' || status === 'success'}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-indigo-400 focus:outline-none disabled:opacity-50" 
        />
        <button 
          onClick={handleSubscribe}
          disabled={status === 'submitting' || status === 'success'}
          className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {status === 'success' ? 'JOINED!' : status === 'submitting' ? '...' : 'SUBSCRIBE'}
        </button>
      </div>
      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="flex gap-4">
          <div className="text-white/40 text-xs">PayPal Checkout <span className="text-white">Enabled</span></div>
          <div className="text-white/40 text-xs">AliExpress API <span className="text-white">Live Tracking</span></div>
        </div>
        <div className="bg-white px-3 py-1 rounded-md text-[10px] font-bold text-indigo-900">
          SECURE CONNECTION
        </div>
      </div>
    </footer>
  );
}
