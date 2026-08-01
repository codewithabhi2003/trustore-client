import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRating from './StarRating';
import Button from '../common/Button';
import api from '../../services/api';

export default function ReviewForm({ orderId, storeId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Pick a star rating first');
      return;
    }
    setLoading(true);
    try {
      await api.post('/reviews', { orderId, storeId, rating, comment });
      toast.success('Thanks for the review!');
      onSubmitted?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit your review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-card shadow-sm p-5 space-y-4">
      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">How was your order?</label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell others what stood out (optional)"
        rows={3}
        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-accent resize-none"
      />
      <Button type="submit" loading={loading}>
        Submit review
      </Button>
    </form>
  );
}
