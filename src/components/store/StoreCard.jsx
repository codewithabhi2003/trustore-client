import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import VerifiedBadge from './VerifiedBadge';
import { formatDistance } from '../../utils/geoUtils';

export default function StoreCard({ store }) {
  return (
    <Link
      to={`/store/${store._id}`}
      className="group flex-shrink-0 w-64 bg-card border border-border rounded-card shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-28 bg-gradient-to-br from-accent-soft to-accent-blue/10 flex items-center justify-center text-4xl">
        {store.logo ? (
          <img src={store.logo} alt={store.storeName} className="w-full h-full object-cover" />
        ) : (
          '🏪'
        )}
        <span
          className={`absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm ${
            store.isOpen !== false ? 'bg-black/40 text-white' : 'bg-black/40 text-white/70'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${store.isOpen !== false ? 'bg-accent' : 'bg-text-muted'}`} />
          {store.isOpen !== false ? 'Open' : 'Closed'}
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading font-bold text-text-primary leading-tight">
            {store.storeName}
          </h3>
          <VerifiedBadge />
        </div>
        <p className="text-xs text-text-muted mt-1">{store.category}</p>

        <div className="flex items-center justify-between mt-3 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-accent-yellow fill-accent-yellow" />
            {store.rating?.toFixed(1) ?? 'New'}
          </span>
          {typeof store.distanceKm === 'number' && (
            <span className="inline-flex items-center gap-1 font-nums">
              <MapPin className="w-3.5 h-3.5" />
              {formatDistance(store.distanceKm)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}