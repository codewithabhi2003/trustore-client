import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import OrderTimeline from '../../components/order/OrderTimeline';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order || res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen label="Confirming your order..." />;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-8 h-8 text-accent" />
      </div>
      <h1 className="text-2xl font-heading font-bold text-text-primary">Order placed!</h1>
      <p className="text-sm text-text-secondary mt-2">
        {order ? `Your order for ${formatPrice(order.totalAmount)} is on its way to being prepared.` : 'Your order has been confirmed.'}
      </p>

      {order && (
        <div className="bg-card border border-border rounded-card shadow-sm p-6 mt-8 text-left">
          <OrderTimeline status={order.status} />
        </div>
      )}

      <div className="flex justify-center gap-3 mt-8">
        <Link to="/orders">
          <Button variant="secondary">Track my orders</Button>
        </Link>
        <Link to="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}
