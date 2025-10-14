import axios from 'axios';
import { Product, ProductInput, ProductUpdate, StockAdjustment } from '../../models/products/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

export const createProduct = async (data: ProductInput): Promise<Product> => {
  const res = await axios.post(`${API_URL}/products`, data);
  return res.data;
};

export const updateProduct = async (id: string, data: ProductUpdate): Promise<Product> => {
  const res = await axios.patch(`${API_URL}/products/${id}`, data);
  return res.data;
};

export const adjustStock = async (variantId: string, data: StockAdjustment): Promise<Product> => {
  const res = await axios.patch(`${API_URL}/products/variant/${variantId}/stock`, data);
  return res.data;
};

export const archiveProduct = async (id: string): Promise<Product> => {
  const res = await axios.patch(`${API_URL}/products/${id}/archive`);
  return res.data;
};
