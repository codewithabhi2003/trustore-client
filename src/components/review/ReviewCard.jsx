import StarRating from './StarRating';
import { timeAgo } from '../../utils/formatDate';

export default function ReviewCard({ review }) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-text-primary">{review.customerId?.name || 'Customer'}</span>
        <span className="text-xs text-text-muted">{timeAgo(review.createdAt)}</span>
      </div>
      <StarRating value={review.rating} readOnly size="sm" />
      {review.comment && <p className="text-sm text-text-secondary mt-2">{review.comment}</p>}
    </div>
  );
}
