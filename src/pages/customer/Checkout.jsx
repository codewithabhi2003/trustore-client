import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  CreditCard,
  MapPin,
  Plus,
  Check,
  Store,
  ShieldCheck,
  ArrowLeft,
  Package,
  ChevronRight,
} from 'lucide-react';

import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import api from '../../services/api';

const RAZORPAY_CONFIGURED =
  !!import.meta.env.VITE_RAZORPAY_KEY_ID &&
  import.meta.env.VITE_RAZORPAY_KEY_ID !==
    'your_razorpay_key_id';

const formatAddress = (address) =>
  address?.fullAddress ||
  [
    address?.street,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

export default function Checkout() {
  const {
    subtotal,
    storeGroups,
    clearCart,
  } = useCart();

  const [placing, setPlacing] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const navigate = useNavigate();

  const groups = Object.entries(storeGroups);

  const totalItems = useMemo(
    () =>
      groups.reduce(
        (total, [, group]) =>
          total +
          group.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          ),
        0
      ),
    [groups]
  );

  useEffect(() => {
    api
      .get('/addresses')
      .then((res) => {
        const list =
          res.data.addresses ||
          res.data ||
          [];

        setAddresses(list);

        const defaultAddress =
          list.find(
            (address) => address.isDefault
          ) || list[0];

        if (defaultAddress) {
          setSelectedId(defaultAddress._id);
        }
      })
      .catch(() => {
        setAddresses([]);
        toast.error(
          'Could not load your saved addresses.'
        );
      })
      .finally(() =>
        setLoadingAddresses(false)
      );
  }, []);

  const handlePayment = async () => {
    const deliveryAddress =
      addresses.find(
        (address) =>
          address._id === selectedId
      );

    if (!deliveryAddress) {
      toast.error(
        'Please select a delivery address'
      );
      return;
    }

    setPlacing(true);

    try {
      /*
       * A cluster order can span multiple stores.
       * The backend creates one Order document per
       * store and returns orderIds together with the
       * first order id used for the payment.
       */
      const { data: orderData } =
        await api.post('/orders', {
          storeGroups,
          deliveryAddress,
        });

      const { data } = await api.post(
        '/payment/create-order',
        {
          totalAmount: orderData.totalAmount,
          orderId: orderData._id,
        }
      );

      /*
       * Razorpay returns snake_case fields.
       * Explicitly map them to the backend's
       * verification payload.
       */
      const completeOrder = async (
        rzpResponse
      ) => {
        await api.post('/payment/verify', {
          razorpayOrderId:
            rzpResponse.razorpay_order_id,

          razorpayPaymentId:
            rzpResponse.razorpay_payment_id,

          razorpaySignature:
            rzpResponse.razorpay_signature,

          orderId: orderData._id,
          orderIds: orderData.orderIds,
        });

        clearCart();

        navigate(
          `/order-success/${orderData._id}`
        );
      };

      /*
       * Development/mock payment mode.
       */
      if (
        !RAZORPAY_CONFIGURED ||
        data.mock
      ) {
        toast.success(
          'Payment gateway not connected yet — completing your order directly.'
        );

        await completeOrder({
          razorpay_order_id:
            data.razorpayOrderId,

          razorpay_payment_id: '',

          razorpay_signature: '',
        });

        return;
      }

      const options = {
        key: import.meta.env
          .VITE_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: 'INR',

        name: 'Trustore',

        description:
          'Grocery order payment',

        order_id:
          data.razorpayOrderId,

        handler: completeOrder,

        theme: {
          color: '#00C896',
        },

        modal: {
          ondismiss: () =>
            toast.error(
              'Payment cancelled'
            ),
        },
      };

      new window.Razorpay(
        options
      ).open();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not start checkout. Please try again.'
      );
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="mb-7">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-accent transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to cart
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Secure checkout
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Checkout
        </h1>

        <p className="text-sm text-text-muted mt-1.5">
          Confirm your delivery address and
          review your order before payment.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 lg:items-start">

        {/* Main checkout */}
        <div className="space-y-5">

          {/* Delivery address */}
          <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Delivery address
                  </h2>

                  <p className="text-[11px] text-text-muted mt-0.5">
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <Link
                to="/addresses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark"
              >
                <Plus className="w-3.5 h-3.5" />
                Add new
              </Link>
            </div>

            <div className="p-5">

              {loadingAddresses ? (
                <div className="py-5">
                  <Loader label="Loading addresses..." />
                </div>
              ) : addresses.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-5 h-5 text-text-muted" />
                  </div>

                  <p className="text-sm font-semibold text-text-primary">
                    No saved address
                  </p>

                  <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                    Add a delivery address before
                    placing your order.
                  </p>

                  <Link
                    to="/addresses"
                    className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-accent"
                  >
                    Add an address
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {addresses.map((address) => {
                    const selected =
                      selectedId ===
                      address._id;

                    return (
                      <button
                        key={address._id}
                        type="button"
                        onClick={() =>
                          setSelectedId(
                            address._id
                          )
                        }
                        className={`w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all ${
                          selected
                            ? 'border-accent bg-accent-soft shadow-sm'
                            : 'border-border hover:border-accent/40'
                        }`}
                      >
                        {/* Radio */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            selected
                              ? 'border-accent bg-accent'
                              : 'border-border-strong'
                          }`}
                        >
                          {selected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>

                        {/* Address */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-text-primary">
                              {address.label ||
                                'Address'}
                            </p>

                            {address.isDefault && (
                              <span className="text-[10px] font-semibold bg-accent-soft text-accent px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-text-secondary leading-relaxed mt-1">
                            {formatAddress(
                              address
                            )}
                          </p>
                        </div>

                        {selected && (
                          <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Store breakdown */}
          <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                  <Store className="w-4 h-4 text-text-muted" />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-text-primary">
                    Order details
                  </h2>

                  <p className="text-[11px] text-text-muted mt-0.5">
                    {totalItems} item
                    {totalItems !== 1
                      ? 's'
                      : ''}{' '}
                    from {groups.length} store
                    {groups.length !== 1
                      ? 's'
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-border">
              {groups.map(
                ([storeId, group]) => {
                  const storeTotal =
                    group.items.reduce(
                      (sum, item) =>
                        sum +
                        item.price *
                          item.quantity,
                      0
                    );

                  return (
                    <div
                      key={storeId}
                      className="p-5"
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Store className="w-3.5 h-3.5 text-accent shrink-0" />

                          <span className="text-sm font-semibold text-text-primary truncate">
                            {group.storeName}
                          </span>
                        </div>

                        <span className="text-sm font-nums font-semibold text-text-primary shrink-0">
                          {formatPrice(
                            storeTotal
                          )}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {group.items.map(
                          (item) => (
                            <div
                              key={
                                item.productId
                              }
                              className="flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-md bg-surface flex items-center justify-center font-nums font-semibold text-text-secondary shrink-0">
                                  {item.quantity}
                                </span>

                                <span className="text-text-secondary truncate">
                                  {item.name}
                                </span>
                              </div>

                              <span className="font-nums text-text-muted shrink-0">
                                {formatPrice(
                                  item.price *
                                    item.quantity
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24">

          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Payment summary
              </h2>

              <p className="text-[11px] text-text-muted mt-0.5">
                Your final order amount
              </p>
            </div>

            <div className="p-5">

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Items
                  </span>

                  <span className="font-nums text-text-primary">
                    {totalItems}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Stores
                  </span>

                  <span className="font-nums text-text-primary">
                    {groups.length}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    Subtotal
                  </span>

                  <span className="font-nums text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-semibold text-text-primary">
                    Total
                  </span>

                  <span className="text-xl font-nums font-extrabold text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-5"
                loading={placing}
                disabled={
                  !selectedId ||
                  loadingAddresses ||
                  addresses.length === 0
                }
                onClick={handlePayment}
              >
                <CreditCard className="w-4 h-4" />
                Pay {formatPrice(subtotal)}
              </Button>

              <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-surface">
                <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />

                <p className="text-[11px] text-text-muted leading-relaxed">
                  Your payment is securely processed
                  through Razorpay. Your card and
                  payment details are not stored by
                  Trustore.
                </p>
              </div>
            </div>
          </div>

          {/* Selected address mini preview */}
          {selectedId && (
            <div className="mt-3 bg-card border border-border rounded-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3.5 h-3.5 text-accent" />

                <span className="text-xs font-semibold text-text-primary">
                  Delivering to
                </span>
              </div>

              {(() => {
                const selected =
                  addresses.find(
                    (address) =>
                      address._id ===
                      selectedId
                  );

                if (!selected) return null;

                return (
                  <>
                    <p className="text-xs font-semibold text-text-primary">
                      {selected.label ||
                        'Address'}
                    </p>

                    <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">
                      {formatAddress(
                        selected
                      )}
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          <Link
            to="/cart"
            className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to cart
          </Link>
        </aside>
      </div>
    </div>
  );
}