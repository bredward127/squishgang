'use client';

import { Product } from '@/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { motion } from 'motion/react';
import { ShoppingCart } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:ring-2 hover:ring-pink-400 transition-all flex flex-col h-full"
    >
      <Link href={`/product/${product.id}`} className="relative aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden block">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2">
          <span className="bg-pink-500 text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="flex flex-col flex-grow">
        <Link href={`/product/${product.id}`}>
          <h4 className="font-bold text-slate-700 mb-1 line-clamp-2 hover:text-pink-600 transition-colors">
            {product.title}
          </h4>
        </Link>
        <div className="mt-auto pt-2 flex flex-col justify-end">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-black text-blue-600 italic">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2 bg-pink-500 hover:bg-pink-600 transition-colors text-white rounded-lg font-bold text-sm"
          >
            Add to Box
          </button>
        </div>
      </div>
    </motion.div>
  );
}
