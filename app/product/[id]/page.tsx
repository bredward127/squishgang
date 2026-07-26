import { products } from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from './AddToCartButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = products.find(p => p.id === resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="flex-1 bg-slate-50">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-4">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover rounded-xl"
              referrerPolicy="no-referrer"
              priority
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest shadow-sm mb-4 border border-indigo-100">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight mb-4">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-blue-600 italic">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="text-slate-600 mb-8 text-sm leading-relaxed">
              <p className="mb-4">
                Perfect for stress relief, sensory stimulation, and just plain fun. This squishy is designed for satisfying tactile feedback and durability.
              </p>
              <ul className="space-y-2 font-medium">
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-pink-500"></div> Soft and satisfying texture</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Excellent for stress & anxiety relief</li>
                <li className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Makes a perfect gift</li>
              </ul>
            </div>
            
            <AddToCartButton product={product} />
            
            <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shipping Info</p>
              <p className="text-xs text-slate-600 font-medium">Ships worldwide. Please allow 10-15 business days for delivery. Dispatched via AliExpress Sync.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
