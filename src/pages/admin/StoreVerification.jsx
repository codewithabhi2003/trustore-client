import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FileText,
  Check,
  X,
  ArrowLeft,
  Store,
  UserRound,
  Phone,
  MapPin,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function StoreVerification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [docs, setDocs] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stores'),
      api.get(`/admin/store/${id}/documents`),
    ])
      .then(([storesRes, docsRes]) => {
        const list =
          storesRes.data.stores ||
          storesRes.data ||
          [];

        setStore(
          list.find((item) => item._id === id) || null
        );

        setDocs(
          docsRes.data.documents ||
          docsRes.data
        );
      })
      .catch(() => {
        setStore(null);
        setDocs(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleApprove = async () => {
    setBusy(true);

    try {
      await api.patch(`/admin/store/${id}/approve`);

      toast.success('Store approved');

      navigate('/admin/stores/pending');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not approve this store.'
      );
    } finally {
      setBusy(false);
    }
  };

  const handleReject = async () => {
    if (!note.trim()) {
      toast.error(
        'Add a reason so the owner knows what to fix'
      );
      return;
    }

    setBusy(true);

    try {
      await api.patch(
        `/admin/store/${id}/reject`,
        {
          adminNote: note.trim(),
        }
      );

      toast.success('Store rejected');

      navigate('/admin/stores/pending');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not reject this store.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading store details..."
      />
    );
  }

  if (!store) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
          <Store className="w-5 h-5 text-text-muted" />
        </div>

        <h1 className="text-lg font-semibold text-text-primary">
          Store not found
        </h1>

        <p className="text-sm text-text-muted mt-1">
          This store may have already been reviewed or no
          longer exists.
        </p>

        <Link
          to="/admin/stores/pending"
          className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-accent hover:text-accent-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to pending stores
        </Link>
      </div>
    );
  }

  const documents = [
    {
      key: 'aadhaarCard',
      title: 'Aadhaar card',
      description:
        'Identity document submitted by the store owner.',
    },
    {
      key: 'shopLicense',
      title: 'Shop license',
      description:
        'Business or shop registration document.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/admin/stores/pending"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to pending stores
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-7">

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.storeName}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <Store className="w-5 h-5 text-text-muted" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                {store.storeName}
              </h1>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                Pending review
              </span>
            </div>

            <p className="text-sm text-text-muted mt-1.5">
              Review the submitted information and documents
              before making a verification decision.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Verification review
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Store information */}
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Store information
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Information submitted during registration.
              </p>
            </div>

            <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-5">

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <UserRound className="w-4 h-4 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Owner
                  </p>

                  <p className="text-sm font-medium text-text-primary mt-1">
                    {store.ownerName || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-text-primary mt-1">
                    {store.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Location
                  </p>

                  <p className="text-sm font-medium text-text-primary mt-1">
                    {store.address?.city || '—'}
                    {store.address?.state
                      ? `, ${store.address.state}`
                      : ''}
                  </p>

                  {store.address?.pincode && (
                    <p className="text-xs text-text-muted mt-0.5">
                      {store.address.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Category
                  </p>

                  <p className="text-sm font-medium text-text-primary mt-1">
                    {store.category || 'Not provided'}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 sm:px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Verification documents
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Open each document and verify that the information
                is clear and valid.
              </p>
            </div>

            <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-3">
              {documents.map((document) => {
                const file = docs?.[document.key];
                const url = file?.url;

                return (
                  <div
                    key={document.key}
                    className="border border-border rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-text-muted" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-text-primary">
                          {document.title}
                        </h3>

                        <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                          {document.description}
                        </p>

                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
                          >
                            View document
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-accent-red">
                            <AlertCircle className="w-3 h-3" />
                            Document unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rejection reason */}
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Review decision
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                If rejecting the store, provide a clear reason
                for the owner.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              <label
                htmlFor="rejection-note"
                className="text-xs font-medium text-text-secondary mb-1.5 block"
              >
                Rejection reason
              </label>

              <textarea
                id="rejection-note"
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                rows={4}
                placeholder="For example: Document is unclear, please upload a clearer copy..."
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent resize-none transition-colors"
              />

              <p className="text-[11px] text-text-muted mt-2">
                This message will be visible to the store owner
                if the application is rejected.
              </p>
            </div>
          </div>
        </div>

        {/* Review sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">

            <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-text-primary">
                  Verification decision
                </h2>

                <p className="text-xs text-text-muted mt-0.5">
                  Choose what happens to this application.
                </p>
              </div>

              <div className="p-5 space-y-3">

                <Button
                  className="w-full"
                  loading={busy}
                  onClick={handleApprove}
                >
                  <Check className="w-4 h-4" />
                  Approve store
                </Button>

                <Button
                  variant="danger"
                  className="w-full"
                  loading={busy}
                  onClick={handleReject}
                >
                  <X className="w-4 h-4" />
                  Reject store
                </Button>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />

                    <p className="text-[11px] leading-relaxed text-text-muted">
                      Make sure the submitted information and
                      documents have been reviewed before approving
                      this store.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}