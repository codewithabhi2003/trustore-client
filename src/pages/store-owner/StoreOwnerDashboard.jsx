import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Wallet, Star, AlertCircle } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusStyles = {
  pending: { label: 'Pending review', color: 'bg-accent-yellow/10 text-accent-yellow' },
  approved: { label: 'Verified', color: 'bg-accent/10 text-accent' },
  rejected: { label: 'Rejected', color: 'bg-accent-red/10 text-accent-red' },
};

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/stores/my-store'), api.get('/orders/store-orders')])
      .then(([storeRes, orderRes]) => {
        setStore(storeRes.data.store || storeRes.data);
        setOrders(orderRes.data.orders || orderRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Loading your dashboard..." />;

  const status = store?.verificationStatus || 'pending';
  const stats = [
    { icon: Package, label: 'Active orders', value: orders.filter((o) => !['Completed', 'Cancelled'].includes(o.status)).length },
    { icon: ShoppingBag, label: 'Total orders', value: store?.totalOrders ?? orders.length },
    { icon: Wallet, label: 'Total revenue', value: formatPrice(orders.reduce((s, o) => s + (o.totalAmount || 0), 0)) },
    { icon: Star, label: 'Rating', value: store?.rating?.toFixed(1) ?? 'New' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Store dashboard</h1>

      <div className={`rounded-card p-4 mb-6 flex items-center justify-between ${statusStyles[status].color}`}>
        <span className="text-sm font-semibold">{statusStyles[status].label}</span>
        {status === 'rejected' && (
          <div className="text-right">
            {store?.adminNote && <p className="text-xs mb-2">{store.adminNote}</p>}
            <Link to="/store-register">
              <Button size="sm" variant="secondary">Resubmit</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-card shadow-sm p-4">
            <s.icon className="w-4 h-4 text-accent mb-2" />
            <div className="text-xl font-nums font-extrabold text-text-primary">{s.value}</div>
            <div className="text-xs text-text-muted mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-8">
        <Link to="/store-owner/products"><Button size="sm" variant="secondary">Manage products</Button></Link>
        <Link to="/store-owner/orders"><Button size="sm" variant="secondary">View all orders</Button></Link>
        <Link to="/store-owner/analytics"><Button size="sm" variant="secondary">Sales analytics</Button></Link>
      </div>

      <h2 className="text-lg font-heading font-bold text-text-primary mb-4">Recent orders</h2>
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-card p-8 text-center text-sm text-text-muted flex flex-col items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          No orders yet.
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-text-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Items</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((o) => (
                <tr key={o._id} className="border-t border-border">
                  <td className="px-4 py-3 font-nums">#{o._id.slice(-6)}</td>
                  <td className="px-4 py-3 text-text-secondary max-w-xs truncate">
                    {o.items?.map((item) => `${item.productName} ×${item.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 font-nums font-semibold">{formatPrice(o.totalAmount)}</td>
                  <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}