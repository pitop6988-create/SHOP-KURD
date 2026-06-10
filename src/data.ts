import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Gas Regulator',
    price: 15000,
    currency: 'IQD',
    imageUrl: 'https://placehold.co/400x400/94a3b8/ffffff?text=Regulator',
  },
  {
    id: '2',
    name: 'Mizgin Empty Cylinder',
    price: 53000,
    currency: 'IQD',
    imageUrl: 'https://placehold.co/400x400/2563eb/ffffff?text=Cylinder',
  },
  {
    id: '3',
    name: 'Mizgin Full Cylinder 12 KG IL...',
    price: 62000,
    currency: 'IQD',
    imageUrl: 'https://placehold.co/400x400/2563eb/ffffff?text=Full+Cylinder',
  },
  {
    id: '4',
    name: 'Cylinder Refill 12 KG',
    price: 9000,
    currency: 'IQD',
    imageUrl: 'https://placehold.co/400x400/2563eb/ffffff?text=Refill',
  }
];

export const formatPrice = (price: number, currency: string) => {
  return `${price.toLocaleString()} ${currency}`;
};
