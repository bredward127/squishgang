'use client';

import Link from 'next/link';
import { ShoppingBag, Search } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:flex w-10 h-10 bg-pink-500 rounded-full items-center justify-center text-white font-bold text-xl">S</div>
            <Link href="/" className="text-2xl font-black tracking-tight text-pink-600 italic uppercase">
              Squishy World
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="I'm shopping for..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </form>

                    <div className="flex items-center gap-6 shrink-0">
            <Link href="/cart" className="relative group">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 group-hover:bg-slate-200 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}