import { useState } from 'react';
import { Trophy, MapPin, AlertTriangle, Sparkles, Check, Store } from 'lucide-react';
import ClusterScore from './ClusterScore';
import Button from '../common/Button';
import { formatDistance } from '../../utils/geoUtils';
import { formatPrice } from '../../utils/formatPrice';

export default function ClusterCard({ cluster, isBest, onAddToCart }) {
  const missing = cluster.productMatches?.filter((p) => !p.available) ?? [];
  const available = cluster.productMatches?.filter((p) => p.available) ?? [];

  // Which specific product (brand/store) is chosen for each requested item, when more
  // than one match exists — defaults to the first match for every item.
  const [selections, setSelections] = useState(() =>
    Object.fromEntries(available.map((p, i) => [i, p.products[0]?._id]))
  );

  const selectedProductFor = (match, index) => {
    const chosenId = selections[index];
    return match.products.find((prod) => prod._id === chosenId) || match.products[0];
  };

  const total = available.reduce((sum, p, i) => {
    const product = selectedProductFor(p, i);
    return sum + (product?.price ?? 0) * (p.requestedQuantity || 1);
  }, 0);

  return (
    <div
      className={`relative rounded-card border p-5 bg-card transition-all duration-200 ${
        isBest
          ? 'border-accent shadow-glow'
          : 'border-border shadow-sm hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      {isBest && (
        <div className="absolute -top-3 left-5 inline-flex items-center gap-1.5 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          <Trophy className="w-3.5 h-3.5" /> Best match
        </div>
      )}

      <div className="flex items-start justify-between mt-1">
        <div>
          <h3 className="font-heading font-bold text-text-primary">
            {isBest ? 'Cluster A' : cluster.clusterId?.replace('cluster_', 'Cluster ')}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">
            <span className="font-nums font-semibold text-text-primary">
              {cluster.availableCount} of {cluster.totalRequested}
            </span>{' '}
            products available &nbsp;•&nbsp;
            <span className="inline-flex items-center gap-1 font-nums">
              <MapPin className="w-3.5 h-3.5 inline -mt-0.5" /> {formatDistance(cluster.distanceKm)} away
            </span>
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-nums font-extrabold text-accent">{cluster.totalScore}</div>
          <div className="text-[10px] text-text-muted uppercase tracking-wide">score</div>
        </div>
      </div>

      <div className="mt-4">
        <ClusterScore cluster={cluster} />
      </div>

      {/* Matched products — the real item(s) found, with image, actual weight, store, and
          price. When more than one store/brand carries an item, pick which one you want. */}
      {available.length > 0 && (
        <div className="mt-4 space-y-3">
          {available.map((match, i) => (
            <div key={i}>
              <p className="text-xs text-text-muted mb-1.5">
                You asked for: <span className="font-medium text-text-secondary">{match.requestedName}</span>
                {match.products.length > 1 && (
                  <span className="ml-1">• {match.products.length} options found, pick one</span>
                )}
              </p>
              <div className="space-y-1.5">
                {match.products.map((product) => {
                  const isSelected = selections[i] === product._id;
                  const hasChoice = match.products.length > 1;
                  return (
                    <button
                      key={product._id}
                      onClick={() => hasChoice && setSelections((prev) => ({ ...prev, [i]: product._id }))}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-colors ${
                        isSelected ? 'border-accent bg-accent-soft' : 'border-border'
                      } ${hasChoice ? 'cursor-pointer hover:border-accent/50' : 'cursor-default'}`}
                    >
                      {hasChoice && (
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-accent bg-accent' : 'border-border-strong'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </span>
                      )}

                      <div className="w-11 h-11 rounded-lg bg-surface flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          '🛍️'
                        )}
                      </div>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-text-primary truncate">{product.name}</span>
                        <span className="flex items-center gap-2 text-xs text-text-muted">
                          <span className="font-nums">{product.unit}</span>
                          <span className="inline-flex items-center gap-1">
                            <Store className="w-3 h-3" /> {product.storeId?.storeName || 'Store'}
                          </span>
                        </span>
                      </span>

                      <span className="font-nums font-semibold text-sm text-text-primary flex-shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {missing.length > 0 && (
        <div className="mt-4 rounded-lg bg-accent-yellow/10 border border-accent-yellow/30 px-3 py-2.5">
          <p className="text-xs text-text-primary flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-yellow flex-shrink-0 mt-0.5" />
            {missing.length} item{missing.length > 1 ? 's' : ''} not available:{' '}
            {missing.map((m) => m.requestedName).join(', ')}
          </p>
          {cluster.borderStoreApplied && (
            <p className="text-xs text-accent mt-1.5 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              Border store{cluster.borderStores.length > 1 ? 's' : ''} nearby can fill{' '}
              {cluster.borderStores
                .flatMap((b) => b.fills)
                .filter((v, i, a) => a.indexOf(v) === i)
                .join(', ')}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <span className="font-nums font-bold text-lg text-text-primary">
          {formatPrice(total)}
        </span>
        <Button
          onClick={() => {
            const chosenProducts = available.map((match, i) => ({
              match,
              product: selectedProductFor(match, i),
            }));
            onAddToCart?.(cluster, chosenProducts);
          }}
          size="sm"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}