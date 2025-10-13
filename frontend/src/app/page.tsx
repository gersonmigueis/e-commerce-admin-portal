"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../lib/api/products';
import { Product } from '../features/products/types';
import { ProductTable } from '../components/ProductTable';

export default function Page() {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Placeholder handlers for actions
  const handleEdit = (product: Product) => {
    // TODO: Open edit modal
  };
  const handleArchive = (product: Product) => {
    // TODO: Archive product
  };
  const handleAdjustStock = (product: Product) => {
    // TODO: Open stock adjustment modal
  };

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
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
    </main>
  );
}
