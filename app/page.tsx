import { products } from '@/data/products';
import { Sidebar } from '@/components/Sidebar';
import { AdSlot } from '@/components/AdSlot';
import { ProductGrid } from '@/components/ProductGrid';
import { sortProducts, SortOption } from '@/lib/sortProducts';

export default async function Home({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const resolvedParams = await searchParams;
  const sort = (resolvedParams.sort as SortOption) || 'bestsellers';
  const sortedProducts = sortProducts(products, sort);

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1400px] mx-auto bg-slate-50 text-slate-800">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">All Squishies</h2>
            <p className="text-slate-500">Showing top high-sensory squishies shipping from USA</p>
          </div>
        </div>

        <AdSlot variant="banner" />

        <ProductGrid products={sortedProducts} />
      </main>
    </div>
  );
}