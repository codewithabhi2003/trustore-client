import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
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
      .then((res) => setStores(res.data.stores || res.data || []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Loading pending stores..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Pending store verifications</h1>

      {stores.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nothing to review" description="New store registrations will appear here." />
      ) : (
        <div className="space-y-4">
          {stores.map((s) => (
            <Link
              key={s._id}
              to={`/admin/stores/${s._id}/verify`}
              className="block bg-card border border-border rounded-card shadow-sm p-5 hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-bold text-text-primary">{s.storeName}</h3>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {s.ownerName} • {s.phone}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {s.address?.city} • {s.category} • Submitted {timeAgo(s.createdAt)}
                  </p>
                </div>
                <span className="text-xs bg-accent-yellow/10 text-accent-yellow px-2.5 py-1 rounded-full font-semibold h-fit">
                  Pending
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
