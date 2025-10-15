import { useState, useEffect, useMemo } from 'react';
import { Product, ProductInput } from '../models/products/types';
import { fetchProducts, updateProduct, adjustStock, archiveProduct } from '../utils/api/products';
import { ProductTable } from '../components/ProductTable';
import { ProductForm } from '../components/ProductForm';
import styles from '../styles/products/ProductStockForm.module.css';

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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Adjust Stock</h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="variant-select" className={styles.label}>Variant</label>
          <div className={styles.selectWrapper}>
            <select 
              id="variant-select"
              value={variantId} 
              onChange={e => setVariantId(e.target.value)} 
              className={styles.input}
            >
              {product.variants.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.sku})</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="new-stock-input" className={styles.label}>New Stock</label>
          <input 
            id="new-stock-input"
            type="number" 
            value={stock} 
            onChange={e => setStock(Number(e.target.value))} 
            className={styles.input} 
            placeholder="e.g., 50"
          />
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <div className={styles.buttonGroup}>
          <button 
            onClick={() => onSubmit(variantId, stock)} 
            className={styles.primaryButton} 
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
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

  const isModalOpen = editModalOpen || adjustModalOpen;

  return (
    <div className={isModalOpen ? 'pageHidden' : ''}>
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
