import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  ClipboardList,
  Clock3,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';

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

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (order) =>
        !['Completed', 'Cancelled'].includes(order.status)
    ).length;

    const completedOrders = orders.filter(
      (order) => order.status === 'Completed'
    ).length;

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    return {
      totalOrders: orders.length,
      activeOrders,
      completedOrders,
      totalRevenue,
    };
  }, [orders]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading platform orders..."
      />
    );
  }

  const summaryCards = [
    {
      icon: ClipboardList,
      label: 'Total orders',
      value: stats.totalOrders,
      description: 'Orders across Trustore',
    },
    {
      icon: Clock3,
      label: 'Active orders',
      value: stats.activeOrders,
      description: 'Currently being fulfilled',
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats.completedOrders,
      description: 'Successfully completed',
    },
    {
      icon: IndianRupee,
      label: 'Order value',
      value: formatPrice(stats.totalRevenue),
      description: 'Total order value',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to admin dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Platform operations
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            All orders
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Monitor orders placed across all stores on the
            Trustore platform.
          </p>
        </div>

        <div className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">
            {orders.length}
          </span>{' '}
          orders recorded
        </div>
      </div>

      {/* Summary cards */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-accent" />
                </div>

                <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary truncate">
                  {card.value}
                </p>

                <p className="text-xs font-medium text-text-primary mt-1">
                  {card.label}
                </p>

                <p className="text-[11px] text-text-muted mt-0.5">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={ShoppingBag}
            title="No orders on the platform yet"
            description="Orders from customers will appear here once stores start receiving them."
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="px-5 sm:px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Platform orders
            </h2>

            <p className="text-xs text-text-muted mt-0.5">
              Review order activity across all Trustore stores.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-muted text-[10px] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">
                    Order
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Store
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Date
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Amount
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-border hover:bg-surface/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-nums font-semibold text-text-primary">
                        #{order._id.slice(-6)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-text-secondary">
                        {order.storeId?.storeName || '—'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="text-text-secondary">
                        {order.customerId?.name || '—'}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="text-text-muted">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-nums font-semibold text-text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <OrderStatusBadge
                        status={order.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold font-nums text-text-primary">
                      #{order._id.slice(-6)}
                    </p>

                    <p className="text-[11px] text-text-muted mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <OrderStatusBadge
                    status={order.status}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-text-muted">
                      Store
                    </p>

                    <p className="text-xs font-medium text-text-primary mt-1 truncate">
                      {order.storeId?.storeName || '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-text-muted">
                      Customer
                    </p>

                    <p className="text-xs font-medium text-text-primary mt-1 truncate">
                      {order.customerId?.name || '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-[10px] uppercase tracking-wide text-text-muted">
                    Order total
                  </span>

                  <span className="text-sm font-nums font-bold text-text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer note */}
      {orders.length > 0 && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text-primary">
              Platform overview:
            </span>{' '}
            Order values above are calculated from the orders
            currently returned by the admin API.
          </p>
        </div>
      )}
    </div>
  );
}