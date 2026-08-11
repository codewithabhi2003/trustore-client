import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Package,
  ShoppingBag,
  Wallet,
  Star,
  AlertCircle,
  Store,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import api from '../../services/api';
import { toggleStoreOpen } from '../../services/storeService';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';

const statusStyles = {
  pending: {
    label: 'Pending review',
    color: 'bg-accent-yellow/10 text-accent-yellow',
    dot: 'bg-accent-yellow',
  },
  approved: {
    label: 'Verified',
    color: 'bg-accent/10 text-accent',
    dot: 'bg-accent',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-accent-red/10 text-accent-red',
    dot: 'bg-accent-red',
  },
};

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-accent' : 'bg-input'
      } ${
        disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'cursor-pointer'
      }`}
      aria-pressed={checked}
      aria-label={checked ? 'Close store' : 'Open store'}
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
    Promise.all([
      api.get('/stores/my-store'),
      api.get('/orders/store-orders'),
    ])
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

      toast.success(
        data.store.isOpen
          ? 'Your store is now shown as open'
          : 'Your store is now shown as closed'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update your store status.'
      );
    } finally {
      setTogglingOpen(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading your dashboard..." />;
  }

  const status = store?.verificationStatus || 'pending';

  const currentStatus =
    statusStyles[status] || statusStyles.pending;

  const activeOrders = orders.filter(
    (order) =>
      !['Completed', 'Cancelled'].includes(order.status)
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const stats = [
    {
      icon: Package,
      label: 'Active orders',
      value: activeOrders,
      description: 'Currently in progress',
    },
    {
      icon: ShoppingBag,
      label: 'Total orders',
      value: store?.totalOrders ?? orders.length,
      description: 'Orders received',
    },
    {
      icon: Wallet,
      label: 'Total revenue',
      value: formatPrice(totalRevenue),
      description: 'From available orders',
    },
    {
      icon: Star,
      label: 'Store rating',
      value:
        store?.rating != null
          ? store.rating.toFixed(1)
          : 'New',
      description:
        store?.rating != null
          ? 'Customer rating'
          : 'No ratings yet',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent mb-2">
            Store management
          </p>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Store dashboard
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            Monitor your store performance and manage daily operations.
          </p>
        </div>

        {status === 'approved' && (
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span
              className={`w-2 h-2 rounded-full ${currentStatus.dot}`}
            />
            {currentStatus.label}
          </div>
        )}
      </div>

      {/* Verification status */}
      <div
        className={`rounded-card p-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${currentStatus.color}`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2 h-2 rounded-full ${currentStatus.dot}`}
          />

          <span className="text-sm font-semibold">
            {currentStatus.label}
          </span>
        </div>

        {status === 'rejected' && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            {store?.adminNote && (
              <p className="text-xs">
                {store.adminNote}
              </p>
            )}

            <Link to="/store-register">
              <Button size="sm" variant="secondary">
                Resubmit
              </Button>
            </Link>
          </div>
        )}

        {status === 'pending' && (
          <p className="text-xs">
            Your store is waiting for administrator verification.
          </p>
        )}
      </div>

      {/* Store availability */}
      {status === 'approved' && (
        <div className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  store?.isOpen
                    ? 'bg-accent/10'
                    : 'bg-surface'
                }`}
              >
                <Store
                  className={`w-4.5 h-4.5 ${
                    store?.isOpen
                      ? 'text-accent'
                      : 'text-text-muted'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    Store availability
                  </p>

                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide ${
                      store?.isOpen
                        ? 'text-accent'
                        : 'text-text-muted'
                    }`}
                  >
                    {store?.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>

                <p className="text-xs text-text-muted mt-0.5">
                  {store?.isOpen
                    ? 'Customers can find and order from your store.'
                    : 'Your store is hidden from customers until you open it.'}
                </p>
              </div>
            </div>

            <Toggle
              checked={!!store?.isOpen}
              onChange={handleToggleOpen}
              disabled={togglingOpen}
            />
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
              </div>

              <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary truncate">
                {stat.value}
              </p>

              <p className="text-xs font-medium text-text-primary mt-1">
                {stat.label}
              </p>

              <p className="text-[11px] text-text-muted mt-0.5">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-card shadow-sm mb-8">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            Quick actions
          </h2>

          <p className="text-xs text-text-muted mt-0.5">
            Manage your store from one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          <Link
            to="/store-owner/products"
            className="group p-4 sm:p-5 hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <Package className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>

              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>

            <p className="text-sm font-semibold text-text-primary mt-4">
              Manage products
            </p>

            <p className="text-xs text-text-muted mt-1">
              Add, edit and manage your inventory.
            </p>
          </Link>

          <Link
            to="/store-owner/orders"
            className="group p-4 sm:p-5 hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>

              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>

            <p className="text-sm font-semibold text-text-primary mt-4">
              View all orders
            </p>

            <p className="text-xs text-text-muted mt-1">
              Review and manage customer orders.
            </p>
          </Link>

          <Link
            to="/store-owner/demand-insights"
            className="group p-4 sm:p-5 hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <TrendingUpIcon />
              </div>

              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>

            <p className="text-sm font-semibold text-text-primary mt-4">
              Demand insights
            </p>

            <p className="text-xs text-text-muted mt-1">
              Discover products customers nearby want.
            </p>
          </Link>

          <Link
            to="/store-owner/analytics"
            className="group p-4 sm:p-5 hover:bg-surface transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <Wallet className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>

              <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </div>

            <p className="text-sm font-semibold text-text-primary mt-4">
              Sales analytics
            </p>

            <p className="text-xs text-text-muted mt-1">
              Track sales and store performance.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent orders */}
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-heading font-bold text-text-primary">
            Recent orders
          </h2>

          <p className="text-xs text-text-muted mt-0.5">
            Your latest customer orders.
          </p>
        </div>

        {orders.length > 0 && (
          <Link
            to="/store-owner/orders"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            View all
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-text-muted" />
          </div>

          <h3 className="text-sm font-semibold text-text-primary">
            No orders yet
          </h3>

          <p className="text-xs text-text-muted mt-1">
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-muted text-[10px] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">
                    Order
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Items
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
                {orders.slice(0, 10).map((order) => (
                  <tr
                    key={order._id}
                    className="border-t border-border hover:bg-surface/60 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-nums font-medium text-text-primary whitespace-nowrap">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3.5 text-text-secondary max-w-xs">
                      <div className="truncate">
                        {order.items
                          ?.map(
                            (item) =>
                              `${item.productName} ×${item.quantity}`
                          )
                          .join(', ')}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-3.5 font-nums font-semibold text-text-primary whitespace-nowrap">
                      {formatPrice(order.totalAmount)}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / bottom view all */}
          <div className="sm:hidden border-t border-border px-4 py-3">
            <Link
              to="/store-owner/orders"
              className="flex items-center justify-center gap-1 text-xs font-medium text-accent"
            >
              View all orders
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

/*
 * Small wrapper keeps the quick-action icon styling consistent
 * without adding another dependency.
 */
function TrendingUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors"
      aria-hidden="true"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}