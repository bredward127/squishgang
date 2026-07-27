import rawData from './products-data.json';

export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  cost: number;
  price: number;
  url: string;
  image: string;
  category: string;
  salesLast30: number | null;
  launchDate: string | null;
}

export const products: Product[] = rawData as Product[];

export const categories = Array.from(new Set(products.map(p => p.category)));