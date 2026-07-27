'use client';

import { Product } from '@/data/products';
import { useCart } from '@/components/CartContext';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all border ${
        added 
          ? 'bg-green-50 text-green-700 border-green-200 ring-2 ring-green-100' 
          : 'bg-pink-500 text-white hover:bg-pink-600 border-pink-600 shadow-sm'
      }`}
    >
      {added ? (
        <>
          <Check className="w-6 h-6" /> ADDED TO BOX
        </>
      ) : (
        <>
          <ShoppingCart className="w-6 h-6" /> ADD TO BOX
        </>
      )}
    </button>
  );
}
