import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, ShoppingBag, Wallet, Star, AlertCircle, Store } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { toggleStoreOpen } from '../../services/storeService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusStyles = {
  pending: { label: 'Pending review', color: 'bg-accent-yellow/10 text-accent-yellow' },
  approved: { label: 'Verified', color: 'bg-accent/10 text-accent' },
  rejected: { label: 'Rejected', color: 'bg-accent-red/10 text-accent-red' },
};

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-input'}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute left-0.5 top-1/2 w-5 h-5 rounded-full bg-white shadow-sm transition-transform -translate-y-1/2 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function StoreOwnerDashboard() {
  const [store, setStore] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingOpen, setTogglingOpen] = useState(false);

  useEffect(() => {
    Promise.all([api.get('/stores/my-store'), api.get('/orders/store-orders')])
      .then(([storeRes, orderRes]) => {
        setStore(storeRes.data.store || storeRes.data);
        setOrders(orderRes.data.orders || orderRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggleOpen = async () => {
    setTogglingOpen(true);
    try {
      const { data } = await toggleStoreOpen();
      setStore(data.store);
      toast.success(data.store.isOpen ? 'Your store is now shown as open' : 'Your store is now shown as closed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update your store status.');
    } finally {
      setTogglingOpen(false);
    }
  };

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

      <div className={`rounded-card p-4 mb-4 flex items-center justify-between ${statusStyles[status].color}`}>
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

      {status === 'approved' && (
        <div className="bg-card border border-border rounded-card shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${store?.isOpen ? 'bg-accent/10' : 'bg-input'}`}>
              <Store className={`w-4 h-4 ${store?.isOpen ? 'text-accent' : 'text-text-muted'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Store is currently{' '}
                <span className={store?.isOpen ? 'text-accent font-semibold' : 'text-text-muted font-semibold'}>
                  {store?.isOpen ? 'Open' : 'Closed'}
                </span>
              </p>
              <p className="text-xs text-text-muted">
                {store?.isOpen
                  ? 'Customers can find you in Browse Stores and the AI assistant.'
                  : "Hidden from Browse Stores and the AI assistant until you're open again."}
              </p>
            </div>
          </div>
          <Toggle checked={!!store?.isOpen} onChange={handleToggleOpen} disabled={togglingOpen} />
        </div>
      )}

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