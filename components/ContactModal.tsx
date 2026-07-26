'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Show modal after a few seconds of browsing
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('squishy_promo_seen');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('squishy_promo_seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      setSubmitted(true);
      setTimeout(() => close(), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md p-8 overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-100"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-full border border-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-indigo-900 mb-2 italic">VIP CLUB</h2>
              <p className="text-slate-500 text-sm">Join our Squishy Club for 15% off your first order and exclusive updates!</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-4 bg-indigo-50 text-indigo-700 rounded-lg font-bold border border-indigo-100"
              >
                Welcome to the club! Check your inbox soon. 💖
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone Number (Optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all outline-none text-slate-800 placeholder-slate-400 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-white font-bold text-sm bg-indigo-900 rounded-lg hover:bg-indigo-800 transition-colors uppercase tracking-widest shadow-sm mt-2 disabled:opacity-70"
                >
                  {isSubmitting ? 'Joining...' : 'Join & Get 15% Off'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
