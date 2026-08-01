import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export default function Cart() {
  const { storeGroups, subtotal, updateQuantity, removeItem, itemCount } = useCart();
  const navigate = useNavigate();
  const groups = Object.entries(storeGroups);

  if (itemCount === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add products from a store, or let the AI assistant build your list for you."
          action={
            <Link to="/shop-ai">
              <Button>Shop with AI</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Your cart</h1>

      <div className="space-y-6">
        {groups.map(([storeId, group]) => (
          <div key={storeId} className="bg-card border border-border rounded-card shadow-sm p-5">
            <h3 className="font-heading font-bold text-text-primary mb-4">{group.storeName}</h3>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center text-xl flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      '🛍️'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-input rounded-full px-1 py-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-elevated"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-nums font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-elevated"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="font-nums font-bold text-sm w-16 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-text-muted hover:text-accent-red transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-5 mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">Subtotal</p>
          <p className="text-xl font-nums font-extrabold text-text-primary">{formatPrice(subtotal)}</p>
        </div>
        <Button size="lg" onClick={() => navigate('/checkout')}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
