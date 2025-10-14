import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductInput, ProductVariant } from '../models/products/types';
import styles from '../styles/products/ProductForm.module.css';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  variants: z.array(
    z.object({
      name: z.string().min(1, 'Variant name required'),
      sku: z.string().min(1, 'Variant SKU required'),
      stock: z.number().min(0, 'Variant stock must be non-negative'),
    })
  ).default([]),
});

type ProductFormProps = {
  initial?: ProductInput;
  onSubmit: (data: ProductInput) => void;
  loading?: boolean;
  error?: string;
};

export function ProductForm({ initial, onSubmit, loading, error }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
  resolver: zodResolver(productSchema),
    defaultValues: initial || {
      name: '', price: 0, category: '', variants: [],
    },
  });
  const [variant, setVariant] = useState<ProductVariant | Omit<ProductVariant, 'id'>>({ name: '', sku: '', stock: 0 });
  const variants = watch('variants') || [];

  const addVariant = () => {
    setValue('variants', [...variants, variant]);
    setVariant({ name: '', sku: '', stock: 0 });
  };

  return (
  <div className={styles.modalOverlay}>
    <div className={styles.modalWrapper}>
      <div className={styles.modalContent}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>
            Edit Product
          </h2>

          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>Name</label>
            <input id="name" {...register('name')} className={`${styles.input} ${errors.name ? styles.error : ''}`} />
            {errors.name && <span className={styles.errorMsg}>{errors.name.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="price" className={styles.label}>Price</label>
              <input id="price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={`${styles.input} ${errors.price ? styles.error : ''}`} />
              {errors.price && <span className={styles.errorMsg}>{errors.price.message}</span>}
            </div>
            <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
              <label htmlFor="category" className={styles.label}>Category</label>
              <input id="category" {...register('category')} className={`${styles.input} ${errors.category ? styles.error : ''}`} />
              {errors.category && <span className={styles.errorMsg}>{errors.category.message}</span>}
            </div>
          </div>

          <div className={styles.variantsSection}>
            <h3 className={styles.label} style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Variants</h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: 0 }}>Add product variations like size or color.</p>
            
            <div className={styles.addVariantForm}>
              <div>
                <label className={styles.label}>Name</label>
                <input placeholder="e.g., Small" value={variant.name} onChange={e => setVariant({ ...variant, name: e.target.value })} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>SKU</label>
                <input placeholder="PROD-SM" value={variant.sku} onChange={e => setVariant({ ...variant, sku: e.target.value })} className={styles.input} />
              </div>
              <div>
                <label className={styles.label}>Stock</label>
                <input type="number" placeholder="100" value={variant.stock} onChange={e => setVariant({ ...variant, stock: Number(e.target.value) })} className={styles.input} />
              </div>
              <button type="button" onClick={addVariant} className={styles.addButton}>Add Variant</button>
            </div>

            {variants.length > 0 && (
              <div className={styles.variantList}>
                {variants.map((v: Omit<ProductVariant, 'id'>, idx: number) => (
                  <div key={idx} className={styles.variantItem}>
                    <span className={styles.variantInfo}>{v.name} ({v.sku}) - Stock: {v.stock}</span>
                    <button type="button" className={styles.removeButton} onClick={() => setValue('variants', variants.filter((_: Omit<ProductVariant, 'id'>, i: number) => i !== idx), { shouldValidate: true })}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {errors.variants && <span className={styles.errorMsg}>{errors.variants.message}</span>}
          </div>

          {error && <div className={styles.errorMsg} style={{ textAlign: 'center' }}>{error}</div>}
          <button type="submit" className={styles.primaryButton} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}
