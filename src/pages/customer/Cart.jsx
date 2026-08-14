import { Link, useNavigate } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Store,
  ArrowRight,
  Package,
} from 'lucide-react';

import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export default function Cart() {
  const {
    storeGroups,
    subtotal,
    updateQuantity,
    removeItem,
    itemCount,
  } = useCart();

  const navigate = useNavigate();
  const groups = Object.entries(storeGroups);

  if (itemCount === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add products from a local store, or let the AI assistant help you find what you need."
            action={
              <Link to="/shop-ai">
                <Button>
                  Shop with AI
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Shopping cart
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Your cart
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            {itemCount} item{itemCount !== 1 ? 's' : ''} from{' '}
            {groups.length} store
            {groups.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-5 lg:items-start">

        {/* Cart items */}
        <div className="space-y-4">
          {groups.map(([storeId, group]) => (
            <div
              key={storeId}
              className="bg-card border border-border rounded-card shadow-sm overflow-hidden"
            >
              {/* Store header */}
              <div className="px-4 sm:px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4 text-text-muted" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-text-muted">
                      Store
                    </p>

                    <h2 className="text-sm font-semibold text-text-primary truncate mt-0.5">
                      {group.storeName}
                    </h2>
                  </div>
                </div>

                <span className="text-xs text-text-muted shrink-0">
                  {group.items.length} item
                  {group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {group.items.map((item) => (
                  <div
                    key={item.productId}
                    className="p-4 sm:p-5"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">

                      {/* Product image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-text-muted" />
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {item.name}
                        </p>

                        {item.unit && (
                          <p className="text-xs text-text-muted mt-1">
                            {item.unit}
                          </p>
                        )}

                        <p className="text-xs text-text-secondary font-nums mt-1">
                          {formatPrice(item.price)} each
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-1 bg-input border border-border rounded-full p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="w-6 text-center text-sm font-nums font-semibold text-text-primary">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item total */}
                      <div className="hidden sm:block w-24 text-right shrink-0">
                        <p className="text-sm font-nums font-bold text-text-primary">
                          {formatPrice(
                            item.price * item.quantity
                          )}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item.productId)
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors shrink-0"
                        aria-label={`Remove ${item.name}`}
                        title={`Remove ${item.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Mobile total */}
                    <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-text-muted">
                        Item total
                      </span>

                      <span className="text-sm font-nums font-bold text-text-primary">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-text-primary">
                Order summary
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Review your cart before checkout.
              </p>
            </div>

            <div className="p-5">

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Items
                  </span>

                  <span className="font-nums text-text-primary">
                    {itemCount}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">
                    Stores
                  </span>

                  <span className="font-nums text-text-primary">
                    {groups.length}
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">
                    Subtotal
                  </span>

                  <span className="text-xl font-nums font-extrabold text-text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mt-5"
                onClick={() => navigate('/checkout')}
              >
                Proceed to checkout
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-start gap-2 mt-4">
                <Store className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />

                <p className="text-[11px] text-text-muted leading-relaxed">
                  Your order is grouped by local store so each
                  store can prepare your items separately.
                </p>
              </div>
            </div>
          </div>

          {/* Continue shopping */}
          <Link
            to="/stores"
            className="flex items-center justify-center gap-1.5 mt-3 text-xs font-semibold text-text-muted hover:text-accent transition-colors"
          >
            Continue shopping
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}