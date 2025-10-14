import { Product } from '../models/products/types';
import { useMemo } from 'react';
import styles from '../styles/products/ProductTable.module.css';

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
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  return (
    <div className={styles.tableWrapper}>
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
        <table className={styles.customTable}>
          <thead className={styles.customThead}>
            <tr>
              <th className={styles.customTh}>Name</th>
              <th className={styles.customTh}>Price</th>
              <th className={styles.customTh}>Category</th>
              <th className={styles.customTh}>Variants</th>
              <th className={styles.customTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className={product.deletedAt ? styles.customTrDark : styles.customTr}>
                <td className={styles.customTd}>{product.name}</td>
                <td className={styles.customTd}>${(product.price ?? 0).toFixed(2)}</td>
                <td className={styles.customTd}>{product.category}</td>
                <td className={styles.customTd}>
                  {product.variants.map(v => (
                    <div key={v.id} className={styles.variant}>
                      {v.name} ({v.sku}) - ${(v.price ?? 0).toFixed(2)} - Stock: {v.stock}
                    </div>
                  ))}
                </td>
                <td className={styles.customTd}>
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
