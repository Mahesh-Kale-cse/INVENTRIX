import { useState, useEffect } from 'react';
import { categoryService } from '../services';
import { Plus, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    reorderLevel: '',
    sku: '',
    categoryId: ''
  });

  const [categories, setCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    loadCategories();
    if (product) {
      setForm({
        ...product,
        categoryId: product.category?.id || ''
      });
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        reorderLevel: '',
        sku: '',
        categoryId: ''
      });
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const newCat = await categoryService.create({ name: newCategoryName });
      setCategories([...categories, newCat]);
      setForm({ ...form, categoryId: newCat.id });
      setNewCategoryName('');
      setIsAddingCategory(false);
      toast.success('Category added!');
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  // ✅ FIX: Send only clean fields to backend, convert categoryId to Number
  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      stockQuantity: form.stockQuantity,
      reorderLevel: form.reorderLevel,
      sku: form.sku,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    };
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Product Name</label>
        <input
          required
          className="form-input"
          placeholder="Enter product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Category</label>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {!isAddingCategory ? (
            <>
              <select
                className="form-select"
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                style={{ flex: 1 }}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-secondary btn-icon"
                onClick={() => setIsAddingCategory(true)}
                title="Add New Category"
              >
                <Plus size={18} />
              </button>
            </>
          ) : (
            <>
              <input
                className="form-input"
                placeholder="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                style={{ flex: 1 }}
                autoFocus
              />
              <button
                type="button"
                className="btn btn-success btn-icon"
                onClick={handleCreateCategory}
              >
                <Check size={18} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => setIsAddingCategory(false)}
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-textarea"
          placeholder="Enter product description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div className="form-group">
          <label className="form-label">Price</label>
          <input
            required
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Stock Quantity</label>
          <input
            required
            type="number"
            className="form-input"
            placeholder="0"
            value={form.stockQuantity}
            onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div className="form-group">
          <label className="form-label">SKU</label>
          <input
            className="form-input"
            placeholder="ABC-123"
            value={form.sku || ''}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Reorder Level</label>
          <input
            type="number"
            className="form-input"
            placeholder="10"
            value={form.reorderLevel}
            onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'flex-end', marginTop: 'var(--space-lg)' }}>
        <button type="button" onClick={onCancel} className="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {product?.id ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
}