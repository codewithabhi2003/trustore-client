import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Package,
  MapPin,
  CreditCard,
  Store,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  Star,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import OrderTimeline from '../../components/order/OrderTimeline';
import Button from '../../components/common/Button';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

const formatAddress = (addr) =>
  addr?.fullAddress ||
  [
    addr?.street,
    addr?.city,
    addr?.state,
    addr?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

export default function OrderDetail() {
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
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            'Could not load this order'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading order..."
      />
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <EmptyState
            icon={Package}
            title="Order not found"
            description="We couldn't find the order you're looking for."
          />

          <div className="flex justify-center pb-6">
            <Link to="/orders">
              <Button size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back to orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderNumber = order._id
    ? order._id.slice(-6)
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back */}
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to orders
      </Link>

      {/* Header */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden mb-5">

        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Package className="w-4 h-4 text-accent" />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Order details
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                Order #{orderNumber}
              </h1>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-xs text-text-muted">

                {order.storeId?.storeName && (
                  <>
                    <Link
                      to={`/store/${order.storeId._id}`}
                      className="inline-flex items-center gap-1 font-medium text-text-secondary hover:text-accent transition-colors"
                    >
                      <Store className="w-3 h-3" />
                      {order.storeId.storeName}
                    </Link>

                    <span>•</span>
                  </>
                )}

                <span>
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>

            <div className="self-start">
              <OrderStatusBadge
                status={order.status}
              />
            </div>
          </div>
        </div>

        {/* Order progress */}
        <div className="border-t border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-accent" />

            <h2 className="text-sm font-semibold text-text-primary">
              Order progress
            </h2>
          </div>

          <OrderTimeline
            status={order.status}
            statusHistory={
              order.statusHistory
            }
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5 items-start">

        {/* Main */}
        <div className="space-y-5">

          {/* Items */}
          <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <Package className="w-4 h-4 text-text-muted" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Items
                </h2>

                <p className="text-[11px] text-text-muted mt-0.5">
                  {order.items?.length || 0}{' '}
                  product
                  {(order.items?.length || 0) !== 1
                    ? 's'
                    : ''} in this order
                </p>
              </div>
            </div>

            <div className="divide-y divide-border">

              {order.items?.map(
                (item, index) => (
                  <div
                    key={
                      item.productId ||
                      item._id ||
                      index
                    }
                    className="p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">

                      {/* Image */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {item.productImage ? (
                          <img
                            src={
                              item.productImage
                            }
                            alt={
                              item.productName
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-text-muted" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {item.productName}
                        </p>

                        <p className="text-xs text-text-muted mt-1">
                          {item.quantity} ×{' '}
                          {formatPrice(
                            item.price
                          )}

                          {item.unit && (
                            <>
                              {' '}
                              • {item.unit}
                            </>
                          )}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="text-right shrink-0">
                        <p className="text-sm font-nums font-bold text-text-primary">
                          {formatPrice(
                            item.price *
                              item.quantity
                          )}
                        </p>

                        <p className="text-[10px] text-text-muted mt-0.5">
                          Item total
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Total */}
            <div className="border-t border-border bg-surface px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-text-primary">
                Order total
              </span>

              <span className="text-xl font-nums font-extrabold text-text-primary">
                {formatPrice(
                  order.totalAmount
                )}
              </span>
            </div>
          </section>

          {/* Delivery address */}
          {(order.deliveryAddress
            ?.fullAddress ||
            order.deliveryAddress
              ?.street) && (
            <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Delivery address
                  </h2>

                  <p className="text-[11px] text-text-muted mt-0.5">
                    Where your order will be delivered
                  </p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-text-primary">
                  {order.deliveryAddress
                    ?.label ||
                    'Delivery address'}
                </p>

                <p className="text-sm text-text-secondary leading-relaxed mt-1">
                  {formatAddress(
                    order.deliveryAddress
                  )}
                </p>
              </div>
            </section>
          )}

          {/* Payment */}
          {order.payment && (
            <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-text-muted" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Payment
                  </h2>

                  <p className="text-[11px] text-text-muted mt-0.5">
                    Payment information for this order
                  </p>
                </div>
              </div>

              <div className="p-5 space-y-3">

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-text-secondary">
                    Amount paid
                  </span>

                  <span className="text-sm font-nums font-semibold text-text-primary">
                    {formatPrice(
                      order.totalAmount
                    )}
                  </span>
                </div>

                {order.payment
                  .razorpayPaymentId && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-text-secondary">
                      Payment ID
                    </span>

                    <span className="font-nums text-text-muted text-[10px] sm:text-xs break-all text-right max-w-[220px]">
                      {
                        order.payment
                          .razorpayPaymentId
                      }
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
                  <span className="text-sm text-text-secondary">
                    Payment status
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      order.payment.status ===
                      'paid'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-accent-yellow/10 text-accent-yellow'
                    }`}
                  >
                    {order.payment.status ===
                      'paid' && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}

                    {order.payment.status}
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 space-y-3">

          {/* Summary */}
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-accent" />

                <h2 className="text-sm font-semibold text-text-primary">
                  Order summary
                </h2>
              </div>
            </div>

            <div className="p-5 space-y-3">

              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  Items
                </span>

                <span className="font-nums text-text-primary">
                  {order.items?.reduce(
                    (sum, item) =>
                      sum +
                      item.quantity,
                    0
                  ) || 0}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  Order date
                </span>

                <span className="text-text-primary text-xs">
                  {formatDate(
                    order.createdAt
                  )}
                </span>
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  Total
                </span>

                <span className="text-lg font-nums font-extrabold text-text-primary">
                  {formatPrice(
                    order.totalAmount
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Review */}
          {order.status ===
            'Completed' &&
            !order.isReviewed && (
              <div className="bg-card border border-border rounded-card shadow-sm p-5">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center mb-3">
                  <Star className="w-4 h-4 text-accent" />
                </div>

                <h3 className="text-sm font-semibold text-text-primary">
                  How was your order?
                </h3>

                <p className="text-xs text-text-muted leading-relaxed mt-1">
                  Share your experience and help
                  other customers shop with confidence.
                </p>

                <Link
                  to={`/orders/${order._id}/review`}
                >
                  <Button
                    size="sm"
                    className="w-full mt-4"
                  >
                    Leave a review
                  </Button>
                </Link>
              </div>
            )}

          {order.status ===
            'Completed' &&
            order.isReviewed && (
              <div className="bg-accent-soft border border-accent/20 rounded-card p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />

                  <p className="text-xs font-semibold text-accent">
                    Review submitted
                  </p>
                </div>

                <p className="text-[11px] text-text-muted mt-1">
                  Thanks for sharing your experience.
                </p>
              </div>
            )}
        </aside>
      </div>
    </div>
  );
}