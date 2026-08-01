import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, Check, X } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function StoreVerification() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [docs, setDocs] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get(`/admin/stores`), api.get(`/admin/store/${id}/documents`)])
      .then(([storesRes, docsRes]) => {
        const list = storesRes.data.stores || storesRes.data || [];
        setStore(list.find((s) => s._id === id) || null);
        setDocs(docsRes.data.documents || docsRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    setBusy(true);
    try {
      await api.patch(`/admin/store/${id}/approve`);
      toast.success('Store approved');
      navigate('/admin/stores/pending');
    } catch {
      toast.error('Could not approve this store.');
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error('Add a reason so the owner knows what to fix');
      return;
    }
    setBusy(true);
    try {
      await api.patch(`/admin/store/${id}/reject`, { adminNote: note });
      toast.success('Store rejected');
      navigate('/admin/stores/pending');
    } catch {
      toast.error('Could not reject this store.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loader fullScreen label="Loading store details..." />;
  if (!store) return <p className="text-center py-20 text-text-muted">Store not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">{store.storeName}</h1>
      <p className="text-sm text-text-secondary mb-6">
        {store.ownerName} • {store.phone} • {store.address?.city}, {store.address?.state}
      </p>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Documents</h3>
        <div className="grid grid-cols-2 gap-3">
          {['aadhaarCard', 'shopLicense'].map((key) => (
            <a
              key={key}
              href={docs?.[key]?.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 border border-border rounded-lg px-3 py-2.5 text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              <FileText className="w-4 h-4" />
              {key === 'aadhaarCard' ? 'View Aadhaar' : 'View shop license'}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <label className="text-sm font-medium text-text-primary mb-1.5 block">Rejection reason (if rejecting)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Document unclear, please reupload..."
          className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent resize-none"
        />
      </div>

      <div className="flex gap-3">
        <Button className="flex-1" loading={busy} onClick={handleApprove}>
          <Check className="w-4 h-4" /> Approve
        </Button>
        <Button variant="danger" className="flex-1" loading={busy} onClick={handleReject}>
          <X className="w-4 h-4" /> Reject
        </Button>
      </div>
    </div>
  );
}
