"use client";
import { ProductInput } from '../models/products/types';
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ProductForm } from '../components/ProductForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct, adjustStock, archiveProduct } from '../utils/api/products';
import { Product } from '../models/products/types';
import { ProductTable } from '../components/ProductTable';

export default function Page() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductInput | undefined>(undefined);
  const [editProductId, setEditProductId] = useState<string | undefined>(undefined);
  const [adjustProduct, setAdjustProduct] = useState<Product | undefined>(undefined);
  const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
  const updateMutation = useMutation({
    mutationFn: (input: { id: string; data: ProductInput }) => updateProduct(input.id, input.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  // Handlers for actions
  const handleEdit = (product: Product) => {
    setEditProductId(product.id);
    setEditProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      variants: product.variants.map(v => ({
        name: v.name,
        sku: v.sku,
        stock: v.stock,
      })),
    });
    setOpen(true);
  };
  const handleArchive = async (product: Product) => {
    try {
      await archiveProduct(product.id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error('Failed to archive product:', error);
    }
  };
  const handleAdjustStock = (product: Product) => {
    setAdjustProduct(product);
    setAdjustStockModalOpen(true);
  };
  const handleCreate = () => {
    setEditProduct(undefined);
    setOpen(true);
  };
  const handleFormSubmit = (data: ProductInput) => {
    if (editProductId) {
      updateMutation.mutate({ id: editProductId, data });
    } else {
      createMutation.mutate(data);
    }
    setOpen(false);
    setEditProductId(undefined);
  };
  const handleAdjustStockSubmit = async (variantId: string, stock: number) => {
    if (!adjustProduct) return;
    try {
      await adjustStock(variantId, { variantId, stock });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setAdjustStockModalOpen(false);
      setAdjustProduct(undefined);
    } catch (error) {
      console.error('Failed to adjust stock:', error);
    }
  };

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreate}>New Product</button>
      </div>
      {isLoading && <div>Loading products...</div>}
      {isError && <div className="text-red-600">Error loading products.</div>}
      {data && (
        <ProductTable
          products={data}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onAdjustStock={handleAdjustStock}
          search={search}
          setSearch={setSearch}
        />
      )}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <Dialog.Title className="text-lg font-bold mb-2">{editProduct ? 'Edit Product' : 'New Product'}</Dialog.Title>
            <ProductForm initial={editProduct} onSubmit={handleFormSubmit} loading={createMutation.isPending || updateMutation.isPending} error={createMutation.error?.message || updateMutation.error?.message} />
            <Dialog.Close asChild>
              <button className="mt-4 px-4 py-2 rounded bg-gray-200">Close</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {/* Stock Adjustment Modal */}
      {adjustStockModalOpen && adjustProduct && (
        <Dialog.Root open={adjustStockModalOpen} onOpenChange={setAdjustStockModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg w-full max-w-lg">
              <Dialog.Title className="text-lg font-bold mb-2">Adjust Stock</Dialog.Title>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const variantId = formData.get('variantId') as string;
                  const stock = Number(formData.get('stock'));
                  handleAdjustStockSubmit(variantId, stock);
                }}
              >
                <label className="block mb-2">Variant</label>
                <select name="variantId" className="border rounded px-3 py-2 w-full mb-4">
                  {adjustProduct.variants.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.sku})</option>
                  ))}
                </select>
                <label className="block mb-2">New Stock</label>
                <input
                  name="stock"
                  type="number"
                  className="border rounded px-3 py-2 w-full mb-4"
                  required
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setAdjustStockModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white"
                  >
                    Save
                  </button>
                </div>
              </form>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </main>
  );
}
