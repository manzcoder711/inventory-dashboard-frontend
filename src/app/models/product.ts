export interface Product{
  id: number;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  quantityInStock: number;
  category: string | null;
  createdAt: string;
  updatedAt: string | null;
}