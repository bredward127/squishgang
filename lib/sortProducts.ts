import { Product } from '@/data/products';

export type SortOption = 'bestsellers' | 'price-asc' | 'price-desc' | 'newest';

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];

  switch (sort) {
    case 'price-asc':
      return arr.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return arr.sort((a, b) => b.price - a.price);

    case 'newest':
      return arr.sort((a, b) => {
        if (a.launchDate === null && b.launchDate === null) return 0;
        if (a.launchDate === null) return 1;
        if (b.launchDate === null) return -1;
        return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
      });

    case 'bestsellers':
    default:
      return arr.sort((a, b) => {
        if (a.salesLast30 === null && b.salesLast30 === null) return 0;
        if (a.salesLast30 === null) return 1;
        if (b.salesLast30 === null) return -1;
        return b.salesLast30 - a.salesLast30;
      });
  }
}