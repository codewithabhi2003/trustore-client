import { Trophy, MapPin, AlertTriangle, Sparkles } from 'lucide-react';
import ClusterScore from './ClusterScore';
import Button from '../common/Button';
import { formatDistance } from '../../utils/geoUtils';
import { formatPrice } from '../../utils/formatPrice';

export default function ClusterCard({ cluster, isBest, onAddToCart }) {
  const missing = cluster.productMatches?.filter((p) => !p.available) ?? [];
  const total = cluster.productMatches
    ?.filter((p) => p.available)
    .reduce((sum, p) => sum + (p.products?.[0]?.price ?? 0) * (p.requestedQuantity || 1), 0);

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

      <div className="mt-4 flex flex-wrap gap-1.5">
        {cluster.stores?.map((s) => (
          <span
            key={s._id}
            className="text-xs bg-elevated border border-border px-2.5 py-1 rounded-full text-text-secondary"
          >
            {s.storeName}
          </span>
        ))}
      </div>

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
        <Button onClick={() => onAddToCart?.(cluster)} size="sm">
          Add to cart
        </Button>
      </div>
    </div>
  );
}
