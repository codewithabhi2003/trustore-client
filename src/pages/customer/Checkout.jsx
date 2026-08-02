import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, MapPin, Plus, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import api from '../../services/api';

const RAZORPAY_CONFIGURED =
  !!import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'your_razorpay_key_id';

export default function Checkout() {
  const { subtotal, storeGroups, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/addresses')
      .then((res) => {
        const list = res.data.addresses || res.data || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedId(def._id);
      })
      .catch(() => setAddresses([]))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const handlePayment = async () => {
    const deliveryAddress = addresses.find((a) => a._id === selectedId);
    if (!deliveryAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setPlacing(true);
    try {
      // A cluster order can span more than one store, so the backend creates one
      // Order document per store and hands back orderIds for all of them alongside
      // a single _id (the first order) that a single Razorpay charge is tied to.
      const { data: orderData } = await api.post('/orders', { storeGroups, deliveryAddress });
      const { data } = await api.post('/payment/create-order', {
        totalAmount: orderData.totalAmount,
        orderId: orderData._id,
      });

      // Razorpay's real checkout callback sends snake_case keys (razorpay_order_id,
      // razorpay_payment_id, razorpay_signature) — map them explicitly rather than
      // spreading the raw response, since the backend's verify endpoint expects
      // camelCase and silently failed signature verification otherwise.
      const completeOrder = async (rzpResponse) => {
        await api.post('/payment/verify', {
          razorpayOrderId: rzpResponse.razorpay_order_id,
          razorpayPaymentId: rzpResponse.razorpay_payment_id,
          razorpaySignature: rzpResponse.razorpay_signature,
          orderId: orderData._id,
          orderIds: orderData.orderIds,
        });
        clearCart();
        navigate(`/order-success/${orderData._id}`);
      };

      // No real Razorpay key configured yet — skip the widget (which can't complete a
      // real transaction anyway) and finish the order directly.
      if (!RAZORPAY_CONFIGURED || data.mock) {
        toast.success('Payment gateway not connected yet — completing your order directly.');
        await completeOrder({ razorpay_order_id: data.razorpayOrderId, razorpay_payment_id: '', razorpay_signature: '' });
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Trustore',
        description: 'Grocery order payment',
        order_id: data.razorpayOrderId,
        handler: completeOrder,
        theme: { color: '#00C896' },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start checkout. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Checkout</h1>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text-primary flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Deliver to
          </h3>
          <Link to="/addresses" className="text-xs font-semibold text-accent inline-flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add new
          </Link>
        </div>

        {loadingAddresses ? (
          <Loader label="Loading addresses..." />
        ) : addresses.length === 0 ? (
          <div className="text-sm text-text-muted">
            You don't have a saved address yet.{' '}
            <Link to="/addresses" className="text-accent font-semibold">Add one</Link> to continue.
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((a) => (
              <button
                key={a._id}
                onClick={() => setSelectedId(a._id)}
                className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  selectedId === a._id ? 'border-accent bg-accent-soft' : 'border-border hover:border-accent/50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedId === a._id ? 'border-accent bg-accent' : 'border-border-strong'
                  }`}
                >
                  {selectedId === a._id && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{a.label || 'Address'}</p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {a.fullAddress || `${a.street}, ${a.city}, ${a.state} ${a.pincode}`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mb-5">
        <h3 className="font-semibold text-text-primary mb-3">Order summary</h3>
        {Object.entries(storeGroups).map(([storeId, group]) => (
          <div key={storeId} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
            <span className="text-text-secondary">{group.storeName}</span>
            <span className="font-nums font-medium">
              {formatPrice(group.items.reduce((s, i) => s + i.price * i.quantity, 0))}
            </span>
          </div>
        ))}
        <div className="flex justify-between text-base font-bold pt-3 mt-2">
          <span>Total</span>
          <span className="font-nums">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        loading={placing}
        disabled={!selectedId}
        onClick={handlePayment}
      >
        <CreditCard className="w-4 h-4" /> Pay {formatPrice(subtotal)}
      </Button>
    </div>
  );
}