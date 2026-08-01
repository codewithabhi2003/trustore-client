import { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/orders')
      .then((res) => setOrders(res.data.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Loading platform orders..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">All orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders on the platform yet" />
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface text-text-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Order</th>
                <th className="text-left px-4 py-3 font-medium">Store</th>
                <th className="text-left px-4 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Amount</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t border-border">
                  <td className="px-4 py-3 font-nums">#{o._id.slice(-6)}</td>
                  <td className="px-4 py-3 text-text-secondary">{o.storeId?.storeName}</td>
                  <td className="px-4 py-3 text-text-secondary">{o.customerId?.name}</td>
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
