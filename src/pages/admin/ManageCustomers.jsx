import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Search } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/customers')
      .then((res) => setCustomers(res.data.customers || res.data || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleBlock = async (customer) => {
    try {
      await api.patch(`/admin/customer/${customer._id}/block`);
      setCustomers((prev) =>
        prev.map((c) => (c._id === customer._id ? { ...c, isActive: !c.isActive } : c))
      );
      toast.success(customer.isActive ? 'Customer blocked' : 'Customer unblocked');
    } catch {
      toast.error('Could not update this customer.');
    }
  };

  const filtered = customers.filter(
    (c) => c.name?.toLowerCase().includes(query.toLowerCase()) || c.email?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <Loader fullScreen label="Loading customers..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Customers</h1>
        <div className="relative">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-9 pr-4 py-2 bg-input border border-border rounded-full text-sm outline-none focus:border-accent w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" />
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-text-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-text-primary">{c.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{c.email}</td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-accent/10 text-accent' : 'bg-accent-red/10 text-accent-red'}`}>
                      {c.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleBlock(c)}
                      className={`text-xs font-semibold ${c.isActive ? 'text-accent-red' : 'text-accent'}`}
                    >
                      {c.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
