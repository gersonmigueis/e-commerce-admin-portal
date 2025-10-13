import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductInput, ProductVariant } from '../models/products/types';
import styles from '../styles/products/ProductForm.module.css';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  category: z.string().min(1, 'Category is required'),
  variants: z.array(
    z.object({
      name: z.string().min(1, 'Variant name required'),
      sku: z.string().min(1, 'Variant SKU required'),
      price: z.number().min(0, 'Variant price must be non-negative'),
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
      name: '', sku: '', price: 0, stock: 0, category: '', variants: [],
    },
  });
  const [variant, setVariant] = useState<ProductVariant | Omit<ProductVariant, 'id'>>({ name: '', sku: '', price: 0, stock: 0 });
  const variants = watch('variants') || [];

  const addVariant = () => {
    setValue('variants', [...variants, variant]);
    setVariant({ name: '', sku: '', price: 0, stock: 0 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formWrapper}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Name</label>
        <input {...register('name')} className={styles.input + (errors.name ? ' error' : '')} />
        {errors.name && <span className={styles.errorMsg}>{errors.name.message}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>SKU</label>
        <input {...register('sku')} className={styles.input + (errors.sku ? ' error' : '')} />
        {errors.sku && <span className={styles.errorMsg}>{errors.sku.message}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Price</label>
        <input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className={styles.input + (errors.price ? ' error' : '')} />
        {errors.price && <span className={styles.errorMsg}>{errors.price.message}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Stock</label>
        <input type="number" {...register('stock', { valueAsNumber: true })} className={styles.input + (errors.stock ? ' error' : '')} />
        {errors.stock && <span className={styles.errorMsg}>{errors.stock.message}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Category</label>
        <input {...register('category')} className={styles.input + (errors.category ? ' error' : '')} />
        {errors.category && <span className={styles.errorMsg}>{errors.category.message}</span>}
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Variants</label>
        <div className={styles.variantInputs}>
          <input placeholder="Name" value={variant.name} onChange={e => setVariant({ ...variant, name: e.target.value })} className={styles.input} />
          <input placeholder="SKU" value={variant.sku} onChange={e => setVariant({ ...variant, sku: e.target.value })} className={styles.input} />
          <input type="number" placeholder="Price" value={variant.price} onChange={e => setVariant({ ...variant, price: Number(e.target.value) })} className={styles.input} />
          <input type="number" placeholder="Stock" value={variant.stock} onChange={e => setVariant({ ...variant, stock: Number(e.target.value) })} className={styles.input} />
          <button type="button" onClick={addVariant} className={styles.primaryButton}>Add</button>
        </div>
        <div className={styles.variantList}>
          {variants.map((v: Omit<ProductVariant, 'id'>, idx: number) => (
            <div key={idx} className={styles.variantItem}>
              <span>{v.name} ({v.sku}) - ${v.price} - Stock: {v.stock}</span>
              <button type="button" className={styles.removeButton} onClick={() => setValue('variants', variants.filter((_: Omit<ProductVariant, 'id'>, i: number) => i !== idx))}>Remove</button>
            </div>
          ))}
        </div>
        {errors.variants && <span className={styles.errorMsg}>{errors.variants.message}</span>}
      </div>
      {error && <div className={styles.errorMsg}>{error}</div>}
      <button type="submit" className={styles.primaryButton} disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</button>
    </form>
  );
}
