import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ReviewForm from '../../components/review/ReviewForm';
import api from '../../services/api';

export default function ReviewSubmit() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order || res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading order..." />;

  if (!order || order.status !== 'Completed') {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <EmptyState
          icon={Package}
          title="This order can't be reviewed"
          description="Only completed orders can be reviewed."
          action={
            <Link to="/orders" className="text-sm font-semibold text-accent">
              Back to my orders
            </Link>
          }
        />
      </div>
    );
  }

  if (order.isReviewed) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <EmptyState
          icon={Package}
          title="You already reviewed this order"
          action={
            <Link to="/orders" className="text-sm font-semibold text-accent">
              Back to my orders
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-1">
        Review your order
      </h1>
      <p className="text-sm text-text-secondary mb-6">{order.storeId?.storeName || 'Trustore order'}</p>

      <ReviewForm
        orderId={order._id}
        storeId={order.storeId?._id || order.storeId}
        onSubmitted={() => {
          toast.success('Thanks for the review!');
          navigate('/orders');
        }}
      />
    </div>
  );
}