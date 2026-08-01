import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

const NEXT_STATUS = {
  'Order Placed': 'Accepted',
  Accepted: 'Preparing',
  Preparing: 'Ready for Pickup',
  'Ready for Pickup': 'Completed',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/store-orders')
      .then((res) => setOrders(res.data.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await api.patch(`/orders/${order._id}/status`, { status: next });
      setOrders((prev) => prev.map((o) => (o._id === order._id ? { ...o, status: next } : o)));
      toast.success(`Order marked as ${next}`);
    } catch {
      toast.error('Could not update order status.');
    }
  };

  if (loading) return <Loader fullScreen label="Loading orders..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Manage orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="New orders from customers will show up here." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-card border border-border rounded-card shadow-sm p-4 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-semibold text-text-primary">#{o._id.slice(-6)}</p>
                <p className="text-xs text-text-muted">{formatDate(o.createdAt)} • {o.items?.length} item(s)</p>
              </div>
              <span className="font-nums font-bold text-sm">{formatPrice(o.totalAmount)}</span>
              <OrderStatusBadge status={o.status} />
              {NEXT_STATUS[o.status] && (
                <button
                  onClick={() => advanceStatus(o)}
                  className="text-xs font-semibold text-accent hover:text-accent-dark"
                >
                  Mark as {NEXT_STATUS[o.status]} →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
