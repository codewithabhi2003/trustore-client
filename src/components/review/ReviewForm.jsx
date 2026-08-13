import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Send } from 'lucide-react';
import StarRating from './StarRating';
import Button from '../common/Button';
import api from '../../services/api';

export default function ReviewForm({ orderId, storeId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;

    if (rating === 0) {
      toast.error('Please choose a star rating first.');
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      await api.post('/reviews', {
        orderId,
        storeId,
        rating,
        comment: comment.trim(),
      });

      toast.success('Thanks for sharing your experience!');
      onSubmitted?.();
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Could not submit your review.'
      );
      submittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-card shadow-sm overflow-hidden"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-accent" />
          </div>

          <div>
            <h2 className="text-base font-heading font-bold text-text-primary">
              Share your experience
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Your feedback helps other shoppers choose with confidence.
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="text-sm font-semibold text-text-primary mb-3 block">
            How was your order?
          </label>

          <div className="flex items-center gap-3">
            <StarRating
              value={rating}
              onChange={setRating}
              size="lg"
            />

            {rating > 0 && (
              <span className="text-sm font-medium text-text-secondary">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Could be better'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very good'}
                {rating === 5 && 'Excellent'}
              </span>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="review-comment"
            className="text-sm font-semibold text-text-primary mb-2 block"
          >
            Your review
            <span className="font-normal text-text-muted ml-1">
              (optional)
            </span>
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like about the store or your order?"
            rows={4}
            maxLength={500}
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 resize-none transition-all"
          />

          <div className="flex justify-end mt-1">
            <span className="text-[11px] text-text-muted">
              {comment.length}/500
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 bg-surface border-t border-border flex justify-end">
        <Button
          type="submit"
          loading={loading}
          disabled={rating === 0}
        >
          <Send className="w-4 h-4" />
          Submit review
        </Button>
      </div>
    </form>
  );
}