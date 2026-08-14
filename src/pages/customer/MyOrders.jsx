import { useEffect, useState } from 'react';
import { Package, ShoppingBag, RefreshCw } from 'lucide-react';
import OrderCard from '../../components/order/OrderCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import api from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    setLoading(true);

    api
      .get('/orders/my-orders')
      .then((res) => {
        setOrders(
          res.data.orders ||
            res.data ||
            []
        );
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading your orders..."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Order history
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            My orders
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            Track your orders and see their latest status.
          </p>
        </div>

        {orders.length > 0 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={loadOrders}
            disabled={loading}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        )}
      </div>

      {/* Summary */}
      {orders.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-text-muted">
            {orders.length} order
            {orders.length !== 1 ? 's' : ''} placed
          </p>

          <div className="inline-flex items-center gap-1.5 text-xs text-text-muted">
            <Package className="w-3.5 h-3.5" />
            Track your deliveries below
          </div>
        </div>
      )}

      {/* Orders */}
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="Once you place an order, you'll be able to track it here from placed to delivered."
          />

          <div className="flex justify-center pb-6">
            <a
              href="/stores"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Start shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}
        </div>
      )}
    </div>
  );
}