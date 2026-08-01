import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import api from '../../services/api';

const RAZORPAY_CONFIGURED =
  !!import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'your_razorpay_key_id';

export default function Checkout() {
  const { subtotal, storeGroups, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    setPlacing(true);
    try {
      // A cluster order can span more than one store, so the backend creates one
      // Order document per store and hands back orderIds for all of them alongside
      // a single _id (the first order) that a single Razorpay charge is tied to.
      let deliveryAddress;
      try {
        const { data: addrData } = await api.get('/addresses');
        const addresses = addrData.addresses || addrData || [];
        deliveryAddress = addresses.find((a) => a.isDefault) || addresses[0];
      } catch {
        // no saved address yet — the order is still created, just without one attached
      }

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

      <Button size="lg" className="w-full" loading={placing} onClick={handlePayment}>
        <CreditCard className="w-4 h-4" /> Pay {formatPrice(subtotal)}
      </Button>
    </div>
  );
}