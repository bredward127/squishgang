import { products } from '@/data/products';
import { Sidebar } from '@/components/Sidebar';
import { ProductGrid } from '@/components/ProductGrid';
import { sortProducts, SortOption } from '@/lib/sortProducts';

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const category = decodeURIComponent(resolvedParams.slug);
  const sort = (resolvedSearchParams.sort as SortOption) || 'bestsellers';
  const categoryProducts = sortProducts(products.filter(p => p.category === category), sort);

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1400px] mx-auto bg-slate-50 text-slate-800">
      <Sidebar activeCategory={category} />
      <main className="flex-1 p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800">{category} Category</h2>
            <p className="text-slate-500">Showing top high-sensory squishies shipping from USA</p>
          </div>
        </div>

        <ProductGrid products={categoryProducts} />
      </main>
    </div>
  );
}