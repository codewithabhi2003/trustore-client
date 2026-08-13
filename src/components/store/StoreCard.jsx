import { Link } from 'react-router-dom';
import { Star, MapPin, ArrowUpRight } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import { formatDistance } from '../../utils/geoUtils';

export default function StoreCard({ store }) {
  return (
    <Link
      to={`/store/${store._id}`}
      className="group block w-full bg-card border border-border rounded-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative h-40 bg-gradient-to-br from-accent-soft via-surface to-accent-blue/10 overflow-hidden">
        {store.logo ? (
          <img
            src={store.logo}
            alt={store.storeName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
              🏪
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3">
          <VerifiedBadge />
        </div>

        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <ArrowUpRight className="w-4 h-4 text-text-primary" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-heading font-bold text-text-primary leading-tight truncate group-hover:text-accent transition-colors">
              {store.storeName}
            </h3>

            <p className="text-xs text-text-muted mt-1 truncate">
              {store.category || 'Local store'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary">
            <span className="w-6 h-6 rounded-full bg-accent-yellow/10 flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-accent-yellow fill-accent-yellow" />
            </span>
            <span className="font-nums font-semibold text-text-primary">
              {store.rating?.toFixed(1) ?? 'New'}
            </span>
            {store.totalRatings > 0 && (
              <span className="text-text-muted">
                ({store.totalRatings})
              </span>
            )}
          </span>

          {typeof store.distanceKm === 'number' && (
            <span className="inline-flex items-center gap-1 text-xs text-text-muted font-nums">
              <MapPin className="w-3.5 h-3.5" />
              {formatDistance(store.distanceKm)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}