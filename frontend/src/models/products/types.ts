export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  variants: ProductVariant[];
  deletedAt?: string | null;
}

export interface ProductInput {
  name: string;
  price: number;
  category: string;
  variants: {
    name: string;
    sku: string;
    stock: number;
  }[];
}

export interface ProductUpdate {
  name?: string;
  sku?: string;
  price?: number;
  stock?: number;
  category?: string;
  variants?: Omit<ProductVariant, 'id'>[];
}

export interface StockAdjustment {
  variantId: string;
  stock: number;
}
