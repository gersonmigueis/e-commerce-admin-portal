import { useState, useEffect, useMemo } from 'react';
import { Product, ProductInput } from '../models/products/types';
import { fetchProducts, updateProduct, adjustStock, archiveProduct } from '../utils/api/products';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';

function AdjustStockModal({ product, onClose, onSubmit, loading, error }: {
  product: Product;
  onClose: () => void;
  onSubmit: (variantId: string, stock: number) => void;
  loading: boolean;
  error?: string;
}) {
  const [variantId, setVariantId] = useState(product.variants[0]?.id || '');
  const [stock, setStock] = useState(0);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Adjust Stock</h2>
        <label className="block mb-2">Variant</label>
        <select value={variantId} onChange={e => setVariantId(e.target.value)} className="border rounded px-3 py-2 w-full mb-4">
          {product.variants.map(v => (
            <option key={v.id} value={v.id}>{v.name} ({v.sku})</option>
          ))}
        </select>
        <label className="block mb-2">New Stock</label>
        <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} className="border rounded px-3 py-2 w-full mb-4" />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button onClick={() => onSubmit(variantId, stock)} className="px-4 py-2 rounded bg-green-600 text-white" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Fetch products on mount
  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (data: ProductInput) => {
    if (!editProduct) return;
    setLoading(true);
    setError(null);
    try {
      await updateProduct(editProduct.id, data);
      // Refresh products after update
      const updated = await fetchProducts();
      setProducts(updated);
      setEditModalOpen(false);
      setEditProduct(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = (product: Product) => {
    console.log('Stock button clicked for product:', product);
    setAdjustProduct(product);
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (variantId: string, stock: number) => {
    setLoading(true);
    setError(null);
    try {
      if (!adjustProduct) return;
      await adjustStock(adjustProduct.id, { variantId, stock });
      // Refresh products after update
      const updated = await fetchProducts();
      setProducts(updated);
      setAdjustModalOpen(false);
      setAdjustProduct(null);
    } catch (err: any) {
      setError(err.message || 'Failed to adjust stock');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      await archiveProduct(product.id);
      const updated = await fetchProducts();
      setProducts(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to archive product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onAdjustStock={handleAdjustStock}
        search={search}
        setSearch={setSearch}
      />
      {editModalOpen && editProduct && (
        <ProductForm
          initial={editProduct}
          onSubmit={handleEditSubmit}
          loading={loading}
          error={error || undefined}
        />
      )}
      {adjustModalOpen && adjustProduct && (
        <AdjustStockModal
          product={adjustProduct}
          onClose={() => { setAdjustModalOpen(false); setAdjustProduct(null); }}
          onSubmit={handleAdjustSubmit}
          loading={loading}
          error={error || undefined}
        />
      )}
    </div>
  );
}
