import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Package,
  User,
  MapPin,
  Phone,
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
  Clock3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
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

const NEXT_STATUS = {
  'Order Placed': 'Accepted',
  Accepted: 'Preparing',
  Preparing: 'Ready for Pickup',
  'Ready for Pickup': 'Completed',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get('/orders/store-orders')
      .then((res) => {
        setOrders(res.data.orders || res.data || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const advanceStatus = async (order) => {
    const next = NEXT_STATUS[order.status];

    if (!next || updatingId) return;

    setUpdatingId(order._id);

    try {
      await api.patch(`/orders/${order._id}/status`, {
        status: next,
      });

      setOrders((prev) =>
        prev.map((item) =>
          item._id === order._id
            ? { ...item, status: next }
            : item
        )
      );

      toast.success(`Order marked as ${next}`);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update order status.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading orders..."
      />
    );
  }

  const activeOrders = orders.filter(
    (order) =>
      !['Completed', 'Cancelled'].includes(order.status)
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === 'Completed'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/store-owner/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Store operations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Manage orders
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Review customer orders and keep their status updated
            throughout the fulfillment process.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span>
            <span className="font-semibold text-text-primary">
              {orders.length}
            </span>{' '}
            total
          </span>

          <span className="w-px h-3 bg-border" />

          <span>
            <span className="font-semibold text-text-primary">
              {activeOrders}
            </span>{' '}
            active
          </span>
        </div>
      </div>

      {/* Summary */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {orders.length}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              Total orders
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Clock3 className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {activeOrders}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              Active orders
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
              <Package className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl font-nums font-extrabold text-text-primary">
              {completedOrders}
            </p>

            <p className="text-xs text-text-muted mt-0.5">
              Completed
            </p>
          </div>
        </div>
      )}

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="New orders from customers will appear here."
          />
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => {
            const nextStatus = NEXT_STATUS[order.status];
            const isUpdating = updatingId === order._id;
            const address = formatAddress(
              order.deliveryAddress
            );

            return (
              <div
                key={order._id}
                className="bg-card border border-border rounded-card shadow-sm overflow-hidden"
              >

                {/* Order header */}
                <div className="px-4 sm:px-5 py-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-text-primary font-nums">
                          #{order._id.slice(-6)}
                        </h2>

                        <span className="text-[10px] text-text-muted">
                          Order
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-text-muted">
                        <span>
                          {formatDate(order.createdAt)}
                        </span>

                        {order.customerId?.name && (
                          <span className="inline-flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {order.customerId.name}
                          </span>
                        )}

                        {order.customerId?.phone && (
                          <a
                            href={`tel:${order.customerId.phone}`}
                            className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            {order.customerId.phone}
                          </a>
                        )}
                      </div>
                    </div>

                    <OrderStatusBadge
                      status={order.status}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-border px-4 sm:px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-3.5 h-3.5 text-text-muted" />

                    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                      Order items
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-text-secondary">
                            <span className="font-nums font-semibold text-text-primary">
                              {item.quantity}×
                            </span>{' '}
                            {item.productName}
                          </p>

                          {item.unit && (
                            <p className="text-[11px] text-text-muted mt-0.5">
                              {item.unit}
                            </p>
                          )}
                        </div>

                        <span className="font-nums text-xs font-medium text-text-primary whitespace-nowrap">
                          {formatPrice(
                            (item.price || 0) *
                              (item.quantity || 0)
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery address */}
                {address && (
                  <div className="border-t border-border px-4 sm:px-5 py-4">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-text-muted" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                          Delivery address
                        </p>

                        <p className="text-xs text-text-secondary leading-relaxed mt-1">
                          {address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-border bg-surface/40 px-4 sm:px-5 py-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-text-muted">
                        Order total
                      </p>

                      <p className="text-base font-nums font-bold text-text-primary mt-0.5">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>

                    {nextStatus && (
                      <button
                        type="button"
                        onClick={() =>
                          advanceStatus(order)
                        }
                        disabled={isUpdating}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isUpdating
                          ? 'Updating...'
                          : `Mark as ${nextStatus}`}

                        {!isUpdating && (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}