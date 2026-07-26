import rawData from './products.json';

export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  cost: number;
  price: number;
  url: string;
  image: string;
  category: string;
}

export const products: Product[] = rawData;

export const categories = Array.from(new Set(products.map(p => p.category)));

