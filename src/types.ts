export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  date: string;
  address?: string;
  phone?: string;
}
