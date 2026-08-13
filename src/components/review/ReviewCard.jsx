import { MessageCircle } from 'lucide-react';
import StarRating from './StarRating';
import { timeAgo } from '../../utils/formatDate';

export default function ReviewCard({ review }) {
  return (
    <div className="py-5 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-accent">
              {(review.customerId?.name || 'C').charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {review.customerId?.name || 'Customer'}
            </p>

            <p className="text-[11px] text-text-muted mt-0.5">
              {timeAgo(review.createdAt)}
            </p>
          </div>
        </div>

        <StarRating
          value={review.rating}
          readOnly
          size="sm"
        />
      </div>

      {review.comment && (
        <div className="mt-3 ml-12">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-text-muted mt-0.5 flex-shrink-0" />

            <p className="text-sm text-text-secondary leading-relaxed">
              {review.comment}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}