import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package, MapPin, CreditCard } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import OrderTimeline from '../../components/order/OrderTimeline';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

// Older orders were saved before fullAddress was reliably populated — fall back to
// building a display string from the individual fields so those still show correctly.
const formatAddress = (addr) =>
  addr?.fullAddress || [addr?.street, addr?.city, addr?.state, addr?.pincode].filter(Boolean).join(', ');

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order || res.data))
      .catch((err) => toast.error(err.response?.data?.message || 'Could not load this order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading order..." />;
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState icon={Package} title="Order not found" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Order #{order._id.slice(-6)}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {order.storeId?.storeName && (
              <Link to={`/store/${order.storeId._id}`} className="hover:text-accent">
                {order.storeId.storeName}
              </Link>
            )}
            {' • '}
            {formatDate(order.createdAt)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">Order progress</h2>
        <OrderTimeline status={order.status} statusHistory={order.statusHistory} />
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Items</h2>
        <div className="space-y-3">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                {item.productImage ? (
                  <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                ) : (
                  '🛍️'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{item.productName}</p>
                <p className="text-xs text-text-muted">{item.quantity} × {formatPrice(item.price)} {item.unit ? `• ${item.unit}` : ''}</p>
              </div>
              <span className="font-nums font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border mt-4 pt-4 flex justify-between text-sm font-bold">
          <span>Total</span>
          <span className="font-nums">{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {(order.deliveryAddress?.fullAddress || order.deliveryAddress?.street) && (
        <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Delivery address
          </h2>
          <p className="text-sm font-semibold text-text-primary">{formatAddress(order.deliveryAddress)}</p>
        </div>
      )}

      {order.payment && (
        <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" /> Payment
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Amount paid</span>
              <span className="font-nums font-semibold text-text-primary">{formatPrice(order.totalAmount)}</span>
            </div>
            {order.payment.razorpayPaymentId && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Payment ID</span>
                <span className="font-nums text-text-muted text-xs">{order.payment.razorpayPaymentId}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Status</span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  order.payment.status === 'paid' ? 'bg-accent/15 text-accent-dark' : 'bg-accent-yellow/10 text-accent-yellow'
                }`}
              >
                {order.payment.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {order.status === 'Completed' && !order.isReviewed && (
        <Link to={`/orders/${order._id}/review`}>
          <Button className="w-full">Leave a review</Button>
        </Link>
      )}
    </div>
  );
}