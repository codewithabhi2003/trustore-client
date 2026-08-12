import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderCard({ order }) {
  const visibleItems = order.items?.slice(0, 3) || [];
  const remainingItems = Math.max((order.items?.length || 0) - 3, 0);

  return (
    <div className="group bg-card border border-border rounded-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0">
              <Package className="w-4.5 h-4.5 text-accent" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-heading font-bold text-text-primary truncate">
                {order.storeId?.storeName || 'Trustore order'}
              </p>

              <p className="text-xs text-text-muted mt-0.5">
                Order #{order._id?.slice(-6)} • {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-5 rounded-xl bg-surface border border-border p-3.5">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Items
            </span>

            {order.items?.length > 0 && (
              <span className="text-[11px] text-text-muted">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <ul className="space-y-1.5">
            {visibleItems.map((item, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <span className="text-text-secondary truncate">
                  <span className="font-nums font-semibold text-text-primary">
                    {item.quantity}×
                  </span>{' '}
                  {item.productName}
                </span>

                <span className="font-nums text-text-muted whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}

            {remainingItems > 0 && (
              <li className="text-[11px] text-accent font-medium pt-0.5">
                + {remainingItems} more item
                {remainingItems !== 1 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>

        <div className="mt-5">
          <OrderTimeline status={order.status} />
        </div>
      </div>

      <div className="border-t border-border bg-surface px-5 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] text-text-muted uppercase tracking-wide">
              Order total
            </p>

            <p className="font-nums font-extrabold text-lg text-text-primary mt-0.5">
              {formatPrice(order.totalAmount)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {order.status === 'Completed' && !order.isReviewed && (
              <Link
                to={`/orders/${order._id}/review`}
                className="text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
              >
                Leave a review
              </Link>
            )}

            <Link
              to={`/orders/${order._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-accent transition-colors"
            >
              View details
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}