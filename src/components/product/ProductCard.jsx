import { Plus, Heart, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../hooks/useWishlist';

export default function ProductCard({ product, onAdd, storeId, storeName }) {
  const hasDiscount = product.mrp && product.mrp > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="group bg-card border border-border rounded-card shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative h-40 bg-surface overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
              🛍️
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />

        {hasDiscount && (
          <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-accent-red px-2.5 py-1 rounded-full shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product, storeId, storeName)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 ${
            wishlisted
              ? 'bg-accent-red/10 dark:bg-accent-red/15'
              : 'bg-white/90 dark:bg-slate-900/90'
          }`}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted
                ? 'text-accent-red fill-accent-red'
                : 'text-text-secondary'
            }`}
          />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="min-w-0">
          <h4 className="text-sm font-heading font-bold text-text-primary leading-tight line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h4>

          {product.unit && (
            <p className="text-xs text-text-muted mt-1">
              {product.unit}
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2 font-nums">
              <span className="text-base font-extrabold text-text-primary">
                {formatPrice(product.price)}
              </span>

              {hasDiscount && (
                <span className="text-xs text-text-muted line-through">
                  {formatPrice(product.mrp)}
                </span>
              )}
            </div>

            {hasDiscount && (
              <p className="text-[11px] text-accent font-semibold mt-0.5">
                You save {formatPrice(product.mrp - product.price)}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAdd?.(product)}
            className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 hover:bg-accent-dark hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}