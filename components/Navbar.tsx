'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { categories } from '@/data/products';

export function Navbar() {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 text-slate-500 hover:text-pink-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="hidden md:flex w-10 h-10 bg-pink-500 rounded-full items-center justify-center text-white font-bold text-xl">S</div>
            <Link href="/" className="text-2xl font-black tracking-tight text-pink-600 italic uppercase">
              Squishy World
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex bg-slate-100 rounded-full px-6 py-2 border border-slate-200 gap-4">
              <Link href="/" className="text-slate-600 hover:text-pink-600 font-bold text-sm transition-colors uppercase tracking-tight">
                All
              </Link>
              {categories.map(cat => (
                <Link key={cat} href={`/category/${cat}`} className="text-slate-600 hover:text-pink-600 font-bold text-sm transition-colors uppercase tracking-tight">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-50 border-b border-slate-200 px-4 py-4 space-y-2">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-tight hover:border-pink-300">
            All Squishies
          </Link>
          {categories.map(cat => (
            <Link key={cat} href={`/category/${cat}`} onClick={() => setIsMenuOpen(false)} className="block p-3 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-bold uppercase tracking-tight hover:border-pink-300">
              {cat}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
