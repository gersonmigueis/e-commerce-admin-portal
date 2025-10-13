"use client";
import { ProductInput } from '../models/products/types';
import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ProductForm } from '../components/ProductForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, createProduct, updateProduct } from '../utils/api/products';
import { Product } from '../models/products/types';
import { ProductTable } from '../components/ProductTable';

export default function Page() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductInput | undefined>(undefined);
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
    setEditProduct({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category,
      variants: product.variants.map(v => ({ name: v.name, sku: v.sku, price: v.price, stock: v.stock })),
    });
    setOpen(true);
  };
  const handleArchive = (product: Product) => {
    // TODO: Archive product
  };
  const handleAdjustStock = (product: Product) => {
    // TODO: Open stock adjustment modal
  };
  const handleCreate = () => {
    setEditProduct(undefined);
    setOpen(true);
  };
  const handleFormSubmit = (data: ProductInput) => {
    if (editProduct) {
      // Assume product has an id for update (you may need to pass id differently)
      // You can store the id in a separate state if needed
      // For now, this is a placeholder
      // updateMutation.mutate({ id: productId, data });
    } else {
      createMutation.mutate(data);
    }
    setOpen(false);
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
    </main>
  );
}
