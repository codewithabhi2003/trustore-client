import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Package,
  Star,
  ArrowLeft,
  Store,
  CheckCircle2,
} from 'lucide-react';

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
      .then((res) => {
        setOrder(
          res.data.order ||
            res.data
        );
      })
      .catch(() => {
        setOrder(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading order..."
      />
    );
  }

  /*
   * Order doesn't exist or isn't completed.
   */
  if (!order || order.status !== 'Completed') {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to orders
        </Link>

        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <EmptyState
            icon={Package}
            title="This order can't be reviewed"
            description="Only completed orders can be reviewed."
          />

          <div className="flex justify-center pb-6">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              View my orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Order has already been reviewed.
   */
  if (order.isReviewed) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to orders
        </Link>

        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <div className="p-6 text-center">

            <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-accent" />
            </div>

            <h1 className="text-lg font-heading font-bold text-text-primary">
              Review already submitted
            </h1>

            <p className="text-sm text-text-secondary mt-1.5">
              You've already shared your experience for this order.
            </p>

            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-accent hover:text-accent-dark"
            >
              View my orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back */}
      <Link
        to={`/orders/${order._id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to order
      </Link>

      {/* Header */}
      <div className="mb-6">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
            <Star className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Your feedback
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Review your order
        </h1>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">

          {order.storeId?.storeName && (
            <>
              <Link
                to={`/store/${order.storeId._id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
              >
                <Store className="w-3.5 h-3.5" />
                {order.storeId.storeName}
              </Link>

              <span className="text-text-muted">
                •
              </span>
            </>
          )}

          <span className="text-xs text-text-muted">
            Order #{order._id.slice(-6)}
          </span>
        </div>

        <p className="text-sm text-text-muted mt-3 leading-relaxed">
          Your feedback helps local stores improve and helps other customers make better choices.
        </p>
      </div>

      {/* Review form */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        <div className="px-5 sm:px-6 py-4 border-b border-border">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
              <Star className="w-4 h-4 text-accent" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Share your experience
              </h2>

              <p className="text-[11px] text-text-muted mt-0.5">
                Tell us what you thought about your order.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <ReviewForm
            orderId={order._id}
            storeId={
              order.storeId?._id ||
              order.storeId
            }
            onSubmitted={() => {
              toast.success(
                'Thanks for the review!'
              );

              navigate('/orders');
            }}
          />
        </div>
      </div>

      {/* Reassurance */}
      <div className="flex items-start gap-2.5 mt-4 px-1">

        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />

        <p className="text-[11px] text-text-muted leading-relaxed">
          Reviews are linked to your completed order and help maintain trustworthy feedback on Trustore.
        </p>
      </div>
    </div>
  );
}