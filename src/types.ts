export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  imageUrl: string;
  imageUrls?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  walletBalance: number;
}

export interface AppSettings {
  version: string;
}

export interface PromoCode {
  id: string;
  code: string;
  value: string;
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
