import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, ShoppingBag, Wallet, ArrowRight } from 'lucide-react';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard-stats')
      .then((res) => setStats(res.data.stats || res.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Loading admin dashboard..." />;

  const cards = [
    { icon: Users, label: 'Total customers', value: stats?.totalUsers ?? '—' },
    { icon: Store, label: 'Verified stores', value: stats?.totalStores ?? '—' },
    { icon: ShoppingBag, label: 'Total orders', value: stats?.totalOrders ?? '—' },
    { icon: Wallet, label: 'Platform revenue', value: stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '—' },
  ];

  const links = [
    { to: '/admin/stores/pending', label: 'Pending store verifications' },
    { to: '/admin/customers', label: 'Manage customers' },
    { to: '/admin/orders', label: 'All platform orders' },
    { to: '/admin/analytics', label: 'Analytics' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Admin dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-card border border-border rounded-card shadow-sm p-4">
            <c.icon className="w-4 h-4 text-accent mb-2" />
            <div className="text-xl font-nums font-extrabold text-text-primary">{c.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="bg-card border border-border rounded-card shadow-sm p-5 flex items-center justify-between hover:border-accent transition-colors"
          >
            <span className="text-sm font-semibold text-text-primary">{l.label}</span>
            <ArrowRight className="w-4 h-4 text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
