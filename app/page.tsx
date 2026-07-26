import { products } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { Sidebar } from '@/components/Sidebar';

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1400px] mx-auto bg-slate-50 text-slate-800">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">All Squishies</h2>
            <p className="text-slate-500">Showing top high-sensory squishies shipping from USA</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm">
              Sort: Most Popular
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
