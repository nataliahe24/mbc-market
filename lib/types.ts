export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
}

export interface OrderInput {
  customer: CustomerInfo;
  items: CartItem[];
  paymentMethod: "cash" | "transfer";
  total: number;
}

export interface Order extends OrderInput {
  id: string;
  status: string;
  createdAt: string;
}
