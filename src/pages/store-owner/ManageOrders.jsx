import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Package, User, MapPin, Phone } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

// Older orders were saved before fullAddress was reliably populated — fall back to
// building a display string from the individual fields so those still show correctly.
const formatAddress = (addr) =>
  addr?.fullAddress || [addr?.street, addr?.city, addr?.state, addr?.pincode].filter(Boolean).join(', ');

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Manage orders</h1>

      {orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" description="New orders from customers will show up here." />
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-card border border-border rounded-card shadow-sm p-4">
              <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold text-text-primary">#{o._id.slice(-6)}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {formatDate(o.createdAt)}
                    {o.customerId?.name && (
                      <span className="inline-flex items-center gap-1">
                        • <User className="w-3 h-3" /> {o.customerId.name}
                      </span>
                    )}
                    {o.customerId?.phone && (
                      <span className="inline-flex items-center gap-1">
                        • <Phone className="w-3 h-3" /> {o.customerId.phone}
                      </span>
                    )}
                  </p>
                </div>
                <OrderStatusBadge status={o.status} />
              </div>

              <ul className="border-t border-b border-border py-3 space-y-1.5">
                {o.items?.map((item, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">
                      <span className="font-nums font-semibold text-text-primary">{item.quantity}×</span>{' '}
                      {item.productName}
                      {item.unit ? <span className="text-text-muted"> ({item.unit})</span> : null}
                    </span>
                    <span className="font-nums text-text-muted">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              {(o.deliveryAddress?.fullAddress || o.deliveryAddress?.street) && (
                <p className="text-xs text-text-secondary flex items-start gap-1.5 pt-3">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  {formatAddress(o.deliveryAddress)}
                </p>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3 pt-3">
                <span className="font-nums font-bold text-text-primary">Total: {formatPrice(o.totalAmount)}</span>
                {NEXT_STATUS[o.status] && (
                  <button
                    onClick={() => advanceStatus(o)}
                    className="text-xs font-semibold text-accent hover:text-accent-dark"
                  >
                    Mark as {NEXT_STATUS[o.status]} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}