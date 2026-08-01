import { Plus, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';
import { useWishlist } from '../../hooks/useWishlist';

export default function ProductCard({ product, onAdd, storeId, storeName }) {
  const hasDiscount = product.mrp && product.mrp > product.price;
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product._id);

  return (
    <div className="bg-card border border-border rounded-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="h-32 bg-surface flex items-center justify-center text-3xl relative">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          '🛍️'
        )}
        <button
          onClick={() => toggleWishlist(product, storeId, storeName)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'text-accent-red fill-accent-red' : 'text-text-muted'}`} />
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-sm font-semibold text-text-primary leading-tight line-clamp-2">
          {product.name}
        </h4>
        <p className="text-xs text-text-muted mt-0.5">{product.unit}</p>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5 font-nums">
            <span className="text-sm font-bold text-text-primary">{formatPrice(product.price)}</span>
            {hasDiscount && (
              <span className="text-xs text-text-muted line-through">{formatPrice(product.mrp)}</span>
            )}
          </div>
          <button
            onClick={() => onAdd?.(product)}
            className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center hover:bg-accent-dark transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}