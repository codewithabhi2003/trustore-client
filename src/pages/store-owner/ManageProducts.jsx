import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  ImagePlus,
  ArrowLeft,
  Boxes,
  IndianRupee,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

const emptyForm = {
  name: '',
  price: '',
  mrp: '',
  unit: '',
  stock: '',
  tags: '',
  image: null,
};

function FieldLabel({ children, optional = false }) {
  return (
    <label className="text-xs font-medium text-text-secondary mb-1.5 block">
      {children}
      {optional && (
        <span className="text-text-muted font-normal ml-1">
          (optional)
        </span>
      )}
    </label>
  );
}

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);

    api
      .get('/products', { params: { mine: true } })
      .then((res) => {
        setProducts(
          res.data.products || res.data || []
        );
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setExistingImage(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name || '',
      price: product.price ?? '',
      mrp: product.mrp ?? '',
      unit: product.unit || '',
      stock: product.stock ?? '',
      tags: (product.tags || []).join(', '),
      image: null,
    });

    setExistingImage(product.images?.[0] || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setExistingImage(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error('Please enter a product name.');
      return;
    }

    if (!form.price) {
      toast.error('Please enter a product price.');
      return;
    }

    if (!form.unit.trim()) {
      toast.error('Please enter the product unit.');
      return;
    }

    setSaving(true);

    const fd = new FormData();

    fd.append('name', form.name.trim());
    fd.append('price', form.price);

    if (form.mrp) {
      fd.append('mrp', form.mrp);
    }

    fd.append('unit', form.unit.trim());
    fd.append('stock', form.stock || 0);

    fd.append(
      'tags',
      JSON.stringify(
        form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );

    if (form.image) {
      fd.append('image', form.image);
    }

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, fd);
      } else {
        await api.post('/products', fd);
      }

      closeModal();
      loadProducts();

      toast.success(
        editingId
          ? 'Product updated successfully'
          : 'Product added successfully'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not save this product.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      toast.success('Product deleted');
    } catch {
      toast.error('Could not delete this product.');
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading your products..."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/store-owner/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Boxes className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Store inventory
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Manage products
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            Add, update and manage the products available in your store.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openNew}
          className="self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add product
        </Button>
      </div>

      {/* Inventory summary */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Package className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {products.length}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              Listed products
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Boxes className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {products.filter((product) => product.stock > 0).length}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              In stock
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <IndianRupee className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {products.filter(
                (product) => product.stock <= 0
              ).length}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              Out of stock
            </p>
          </div>
        </div>
      )}

      {/* Products */}
      {products.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={Package}
            title="No products listed yet"
            description="Add your first product so customers can discover and order from your store."
          />

          <div className="flex justify-center pb-8">
            <Button size="sm" onClick={openNew}>
              <Plus className="w-4 h-4" />
              Add your first product
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {products.map((product) => {
            const stock = Number(product.stock || 0);
            const isOutOfStock = stock <= 0;
            const isLowStock = stock > 0 && stock <= 5;

            return (
              <div
                key={product._id}
                className="group bg-card border border-border rounded-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product image */}
                <div className="relative aspect-[16/10] bg-surface overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-10 h-10 text-text-muted" />
                    </div>
                  )}

                  {/* Stock badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                        isOutOfStock
                          ? 'bg-accent-red/10 text-accent-red border border-accent-red/20'
                          : isLowStock
                            ? 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20'
                            : 'bg-card/90 text-accent border border-border'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-accent-red'
                            : isLowStock
                              ? 'bg-accent-yellow'
                              : 'bg-accent'
                        }`}
                      />

                      {isOutOfStock
                        ? 'Out of stock'
                        : isLowStock
                          ? 'Low stock'
                          : 'In stock'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="w-8 h-8 rounded-lg bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-text-muted hover:text-accent transition-colors"
                      aria-label={`Edit ${product.name}`}
                      title="Edit product"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(product._id)
                      }
                      className="w-8 h-8 rounded-lg bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-text-muted hover:text-accent-red transition-colors"
                      aria-label={`Delete ${product.name}`}
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Product details */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {product.name}
                      </h3>

                      <p className="text-xs text-text-muted mt-1">
                        {product.unit || 'Unit not specified'}
                      </p>
                    </div>

                    <p className="text-sm font-nums font-bold text-text-primary whitespace-nowrap">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-text-muted">
                        Stock
                      </p>

                      <p className="text-xs font-nums font-semibold text-text-primary mt-0.5">
                        {stock} {product.unit || 'units'}
                      </p>
                    </div>

                    {product.mrp &&
                      Number(product.mrp) > Number(product.price) && (
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-wide text-text-muted">
                            MRP
                          </p>

                          <p className="text-xs font-nums text-text-muted line-through mt-0.5">
                            {formatPrice(product.mrp)}
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Tags */}
                  {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-md bg-surface text-[10px] text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}

                      {product.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-surface text-[10px] text-text-muted">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit product' : 'Add product'}
      >
        <div className="space-y-4">

          {/* Modal description */}
          <p className="text-xs text-text-muted -mt-1">
            {editingId
              ? 'Update the product details below.'
              : 'Add product information so customers can discover it.'}
          </p>

          {/* Product image */}
          <div>
            <FieldLabel>Product photo</FieldLabel>

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-input border border-border flex items-center justify-center overflow-hidden shrink-0">
                {form.image ? (
                  <img
                    src={URL.createObjectURL(form.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : existingImage ? (
                  <img
                    src={existingImage}
                    alt="Current product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImagePlus className="w-5 h-5 text-text-muted" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setForm({
                      ...form,
                      image:
                        event.target.files?.[0] || null,
                    })
                  }
                  className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-xs file:font-semibold"
                />

                <p className="text-[10px] text-text-muted mt-1.5">
                  JPG, PNG or WebP recommended.
                </p>
              </div>
            </div>
          </div>

          {/* Product name */}
          <div>
            <FieldLabel>Product name</FieldLabel>

            <input
              placeholder="e.g. Basmati Rice"
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Selling price</FieldLabel>

              <input
                placeholder="₹ 0"
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  setForm({
                    ...form,
                    price: event.target.value,
                  })
                }
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <FieldLabel optional>MRP</FieldLabel>

              <input
                placeholder="₹ 0"
                type="number"
                min="0"
                value={form.mrp}
                onChange={(event) =>
                  setForm({
                    ...form,
                    mrp: event.target.value,
                  })
                }
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Unit and stock */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Unit</FieldLabel>

              <input
                placeholder="1kg, 500ml..."
                value={form.unit}
                onChange={(event) =>
                  setForm({
                    ...form,
                    unit: event.target.value,
                  })
                }
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <FieldLabel>Stock quantity</FieldLabel>

              <input
                placeholder="0"
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) =>
                  setForm({
                    ...form,
                    stock: event.target.value,
                  })
                }
                className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <FieldLabel optional>
              Search keywords
            </FieldLabel>

            <input
              placeholder="rice, chawal, basmati"
              value={form.tags}
              onChange={(event) =>
                setForm({
                  ...form,
                  tags: event.target.value,
                })
              }
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
            />

            <p className="text-[10px] text-text-muted mt-1.5">
              Separate keywords with commas to help customers find this product.
            </p>
          </div>

          {/* Submit */}
          <Button
            className="w-full mt-2"
            loading={saving}
            onClick={handleSave}
          >
            {editingId
              ? 'Save changes'
              : 'Add product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}