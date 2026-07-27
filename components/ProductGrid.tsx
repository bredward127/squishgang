'use client';
import { useState, Fragment } from 'react';
import { Product } from '@/data/products';
import { ProductCard } from '@/components/ProductCard';
import { AdSlot } from '@/components/AdSlot';

const PAGE_SIZE_OPTIONS = [6, 12, 18, 24];

export function ProductGrid({ products }: { products: Product[] }) {
  const [pageSize, setPageSize] = useState(12);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loadMoreClicks, setLoadMoreClicks] = useState(0);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setVisibleCount(size);
    setLoadMoreClicks(0);
  };

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500 text-lg font-medium">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          Show:
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((product, idx) => (
          <Fragment key={product.id}>
            <ProductCard product={product} />
            {(idx + 1) % 6 === 0 && (
              <div className="col-span-full">
                <AdSlot variant="in-content" />
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              setVisibleCount(prev => Math.min(prev + pageSize, products.length));
              setLoadMoreClicks(prev => prev + 1);
            }}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full shadow-sm transition-colors"
          >
            Load More
          </button>
        </div>
      )}

      {loadMoreClicks >= 3 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-slate-800/40 hover:bg-slate-800/70 text-white flex items-center justify-center shadow-lg backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
        >
          ↑
        </button>
      )}
    </div>
  );
}