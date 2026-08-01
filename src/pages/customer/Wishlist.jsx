import { Link } from 'react-router-dom';
import { Heart, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          action={
            <Link to="/stores">
              <Button>Browse stores</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Your wishlist</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.productId} className="bg-card border border-border rounded-card shadow-sm p-4 flex flex-col">
            <div className="h-28 bg-surface rounded-lg flex items-center justify-center text-2xl mb-3 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                '🛍️'
              )}
            </div>
            <h3 className="text-sm font-semibold text-text-primary leading-tight">{item.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">{item.storeName} • {item.unit}</p>

            <div className="mt-auto pt-3 flex items-center justify-between">
              <span className="font-nums font-bold text-text-primary">{formatPrice(item.price)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addItem(item, item.storeId, item.storeName);
                    toast.success(`${item.name} added to cart`);
                  }}
                  className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-dark transition-colors"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="text-text-muted hover:text-accent-red transition-colors"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}