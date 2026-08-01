import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';
import { formatDate } from '../../utils/formatDate';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderCard({ order }) {
  return (
    <div className="bg-card border border-border rounded-card shadow-sm p-5">
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {order.storeId?.storeName || 'Trustore order'}
          </p>
          <p className="text-xs text-text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <ul className="text-xs text-text-secondary mt-3 space-y-0.5">
        {order.items?.slice(0, 3).map((item, i) => (
          <li key={i}>
            {item.quantity} × {item.productName}
          </li>
        ))}
        {order.items?.length > 3 && <li>+ {order.items.length - 3} more</li>}
      </ul>

      <div className="my-4">
        <OrderTimeline status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        <span className="font-nums font-bold text-text-primary">{formatPrice(order.totalAmount)}</span>
        <div className="flex items-center gap-3">
          {order.status === 'Completed' && !order.isReviewed && (
            <Link to={`/orders/${order._id}/review`} className="text-xs font-semibold text-accent">
              Leave a review
            </Link>
          )}
          <Link to={`/orders/${order._id}`} className="text-xs font-semibold text-text-secondary hover:text-accent">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
