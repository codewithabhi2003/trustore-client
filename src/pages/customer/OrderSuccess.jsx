import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Receipt,
} from 'lucide-react';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import OrderTimeline from '../../components/order/OrderTimeline';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderSuccess() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(
          res.data.order ||
            res.data
        );
      })
      .catch(() => {
        setOrder(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Confirming your order..."
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Success header */}
      <div className="text-center">

        <div className="relative inline-flex mb-5">
          <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-accent" />
          </div>

          <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
            <Package className="w-3 h-3 text-accent" />
          </div>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
          Payment confirmed
        </p>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Order placed!
        </h1>

        <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
          {order
            ? `Your order for ${formatPrice(
                order.totalAmount
              )} has been confirmed and is being prepared.`
            : 'Your order has been successfully confirmed and is being prepared.'}
        </p>

        {order && (
          <p className="text-xs text-text-muted mt-2">
            Order #{order._id.slice(-6)}
          </p>
        )}
      </div>

      {/* Order status */}
      {order && (
        <div className="bg-card border border-border rounded-card shadow-sm mt-8 overflow-hidden">

          <div className="px-5 py-4 border-b border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
              <Receipt className="w-4 h-4 text-accent" />
            </div>

            <div className="text-left">
              <h2 className="text-sm font-semibold text-text-primary">
                Order progress
              </h2>

              <p className="text-[11px] text-text-muted mt-0.5">
                We'll keep you updated as your order moves forward.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <OrderTimeline
              status={order.status}
              statusHistory={order.statusHistory}
            />
          </div>
        </div>
      )}

      {/* Quick summary */}
      {order && (
        <div className="grid grid-cols-2 gap-3 mt-4">

          <div className="bg-card border border-border rounded-xl p-4 text-left">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center mb-2">
              <Package className="w-4 h-4 text-text-muted" />
            </div>

            <p className="text-[11px] text-text-muted">
              Items
            </p>

            <p className="text-sm font-semibold text-text-primary mt-0.5">
              {order.items?.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              ) || 0}{' '}
              item
              {(order.items?.reduce(
                (sum, item) =>
                  sum + item.quantity,
                0
              ) || 0) !== 1
                ? 's'
                : ''}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 text-left">
            <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center mb-2">
              <ShoppingBag className="w-4 h-4 text-text-muted" />
            </div>

            <p className="text-[11px] text-text-muted">
              Total paid
            </p>

            <p className="text-sm font-nums font-bold text-text-primary mt-0.5">
              {formatPrice(
                order.totalAmount
              )}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">

        <Link
          to="/orders"
          className="flex-1 sm:flex-none"
        >
          <Button
            variant="secondary"
            className="w-full"
          >
            <Package className="w-4 h-4" />
            Track my orders
          </Button>
        </Link>

        <Link
          to="/"
          className="flex-1 sm:flex-none"
        >
          <Button className="w-full">
            Continue shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Small reassurance */}
      <p className="text-[11px] text-text-muted text-center mt-6">
        You can view the complete order details and
        delivery progress anytime from My Orders.
      </p>
    </div>
  );
}