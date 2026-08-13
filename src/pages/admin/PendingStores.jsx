import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  ArrowLeft,
  Store,
  Clock3,
  ArrowUpRight,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { timeAgo } from '../../utils/formatDate';
import api from '../../services/api';

export default function PendingStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/pending-stores')
      .then((res) => {
        setStores(res.data.stores || res.data || []);
      })
      .catch(() => {
        setStores([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading pending stores..."
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to admin dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-yellow/10 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-accent-yellow" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent-yellow">
              Store verification
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Pending store verifications
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Review newly registered stores and verify their
            information before they become available on Trustore.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent-yellow" />

          <span>
            <span className="font-semibold text-text-primary">
              {stores.length}
            </span>{' '}
            pending
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-yellow/10 flex items-center justify-center shrink-0">
            <Clock3 className="w-4 h-4 text-accent-yellow" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Verification queue
            </h2>

            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              These stores are waiting for administrator review.
              Open a store to inspect its details and submitted
              documents.
            </p>
          </div>
        </div>
      </div>

      {/* Store list */}
      {stores.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={ClipboardList}
            title="Nothing to review"
            description="New store registrations will appear here when they are submitted for verification."
          />
        </div>
      ) : (
        <div className="space-y-3">

          {stores.map((store) => (
            <Link
              key={store._id}
              to={`/admin/stores/${store._id}/verify`}
              className="group block bg-card border border-border rounded-card shadow-sm hover:border-accent/40 hover:shadow-md transition-all"
            >
              <div className="p-4 sm:p-5">

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Store icon */}
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
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

                  {/* Store information */}
                  <div className="min-w-0 flex-1">

                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {store.storeName}
                      </h3>

                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-yellow/10 text-accent-yellow text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow" />
                        Pending
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary mt-1">
                      {store.ownerName || 'Owner not provided'}

                      {store.phone && (
                        <>
                          <span className="mx-1.5 text-text-muted">
                            •
                          </span>

                          {store.phone}
                        </>
                      )}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-text-muted">

                      {store.address?.city && (
                        <span>
                          {store.address.city}
                        </span>
                      )}

                      {store.category && (
                        <>
                          <span className="text-border">
                            •
                          </span>

                          <span>
                            {store.category}
                          </span>
                        </>
                      )}

                      {store.createdAt && (
                        <>
                          <span className="text-border">
                            •
                          </span>

                          <span>
                            Submitted{' '}
                            {timeAgo(store.createdAt)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:ml-auto">

                    <span className="text-xs font-semibold text-text-muted group-hover:text-accent transition-colors">
                      Review store
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                      <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Footer note */}
      {stores.length > 0 && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text-primary">
              Verification reminder:
            </span>{' '}
            Review the store information and submitted documents
            before approving or rejecting a registration.
          </p>
        </div>
      )}
    </div>
  );
}