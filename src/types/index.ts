export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category?: string;
  stock?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}
