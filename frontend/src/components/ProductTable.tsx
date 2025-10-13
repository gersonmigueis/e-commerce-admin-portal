import { Product } from '../features/products/types';
import { useMemo } from 'react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onArchive: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  search: string;
  setSearch: (value: string) => void;
}

export function ProductTable({ products, onEdit, onArchive, onAdjustStock, search, setSearch }: ProductTableProps) {
  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className="w-full">
      <div className="flex mb-4">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full"
          placeholder="Search by name, SKU, or category"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Variants</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className={product.deletedAt ? 'bg-gray-200' : ''}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2">{product.sku}</td>
                <td className="border px-4 py-2">${(product.price ?? 0).toFixed(2)}</td>
                <td className="border px-4 py-2">{product.stock}</td>
                <td className="border px-4 py-2">{product.category}</td>
                <td className="border px-4 py-2">
                  {product.variants.map(v => (
                    <div key={v.id} className="text-xs">
                      {v.name} ({v.sku}) - ${(v.price ?? 0).toFixed(2)} - Stock: {v.stock}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  <button className="mr-2 text-blue-600" onClick={() => onEdit(product)}>Edit</button>
                  <button className="mr-2 text-yellow-600" onClick={() => onAdjustStock(product)}>Stock</button>
                  <button className="text-red-600" onClick={() => onArchive(product)} disabled={!!product.deletedAt}>Archive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// This component is mobile responsive and supports search/filtering.
// Actions are passed as props for modularity and reuse.
