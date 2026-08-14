import { Link } from 'react-router-dom';
import {
  Heart,
  Plus,
  Trash2,
  ShoppingBag,
  Store,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/formatPrice';

export default function Wishlist() {
  const {
    items,
    removeFromWishlist,
  } = useWishlist();

  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">

        <div className="bg-card border border-border rounded-card shadow-sm p-8 sm:p-12 text-center">

          <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-5">
            <Heart className="w-7 h-7 text-accent" />
          </div>

          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
            Your wishlist is empty
          </h1>

          <p className="text-sm text-text-muted mt-2 max-w-md mx-auto">
            Save products you love and come back to them whenever
            you're ready to shop.
          </p>

          <div className="mt-6">
            <Link to="/stores">
              <Button>
                <ShoppingBag className="w-4 h-4" />
                Browse stores
              </Button>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">

        <div>
          <div className="flex items-center gap-2 mb-2">

            <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
              <Heart className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Saved items
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Your wishlist
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            Products you've saved for later.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1.5 w-fit">
          <Heart className="w-3.5 h-3.5 text-accent" />

          <span className="text-xs font-semibold text-text-primary">
            {items.length}
          </span>

          <span className="text-xs text-text-muted">
            {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

      </div>

      {/* Wishlist grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

        {items.map((item) => (
          <div
            key={item.productId}
            className="group bg-card border border-border rounded-card shadow-sm overflow-hidden flex flex-col transition-all hover:border-accent/40 hover:shadow-md"
          >

            {/* Product image */}
            <div className="relative h-44 bg-surface overflow-hidden">

              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-text-muted" />
                </div>
              )}

              {/* Wishlist remove */}
              <button
                onClick={() =>
                  removeFromWishlist(item.productId)
                }
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-text-muted hover:text-accent-red hover:border-accent-red/30 transition-colors"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Product details */}
            <div className="p-4 flex flex-col flex-1">

              <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2">
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
                <Store className="w-3.5 h-3.5 shrink-0" />

                <span className="truncate">
                  {item.storeName}
                </span>

                {item.unit && (
                  <>
                    <span>•</span>
                    <span className="shrink-0">
                      {item.unit}
                    </span>
                  </>
                )}
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between gap-3 mt-auto pt-5">

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Price
                  </p>

                  <p className="font-nums font-extrabold text-base text-text-primary mt-0.5">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    addItem(
                      item,
                      item.storeId,
                      item.storeName
                    );

                    toast.success(
                      `${item.name} added to cart`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-colors"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Continue shopping */}
      <div className="mt-8 flex justify-center">

        <Link
          to="/stores"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-dark transition-colors"
        >
          Continue shopping
          <ArrowRight className="w-4 h-4" />
        </Link>

      </div>

    </div>
  );
}