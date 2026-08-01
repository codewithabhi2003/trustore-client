import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

const emptyForm = { name: '', price: '', mrp: '', unit: '', stock: '', tags: '' };

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    api
      .get('/products', { params: { mine: true } })
      .then((res) => setProducts(res.data.products || res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadProducts, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, mrp: p.mrp || '', unit: p.unit, stock: p.stock, tags: (p.tags || []).join(', ') });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: form.mrp ? Number(form.mrp) : undefined,
      stock: Number(form.stock),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setModalOpen(false);
      loadProducts();
      toast.success(editingId ? 'Product updated' : 'Product added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save this product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error('Could not delete this product.');
    }
  };

  if (loading) return <Loader fullScreen label="Loading your products..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Manage products</h1>
        <Button size="sm" onClick={openNew}>
          <Plus className="w-4 h-4" /> Add product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState icon={Package} title="No products listed yet" description="Add your first product so customers can find it." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-card border border-border rounded-card shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{p.name}</h3>
                  <p className="text-xs text-text-muted">{p.unit} • Stock: {p.stock}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-text-muted hover:text-accent"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-text-muted hover:text-accent-red"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="font-nums font-bold text-text-primary mt-2">{formatPrice(p.price)}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit product' : 'Add product'}>
        <div className="space-y-3">
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <input placeholder="MRP (₹, optional)" type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Unit (1kg, 500ml...)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <input placeholder="Keywords, comma separated (rice, chawal)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
          <Button className="w-full" loading={saving} onClick={handleSave}>
            {editingId ? 'Save changes' : 'Add product'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
