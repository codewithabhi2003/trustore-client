import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Map as MapIcon,
  LayoutGrid,
  Star,
  MapPin,
  Store,
  Navigation,
} from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';

import StoreCard from '../../components/store/StoreCard';
import VerifiedBadge from '../../components/store/VerifiedBadge';
import EmptyState from '../../components/common/EmptyState';
import FadeIn from '../../components/common/FadeIn';
import { useUserLocation } from '../../hooks/useLocation';
import { getNearbyStores } from '../../services/storeService';
import { formatDistance } from '../../utils/geoUtils';

const storeIcon = L.divIcon({
  html: `
    <div style="
      background:#00C896;
      width:34px;
      height:34px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.25);
      font-size:16px;
    ">
      🏪
    </div>
  `,
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const customerIcon = L.divIcon({
  html: `
    <div style="
      background:#F97316;
      width:34px;
      height:34px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 3px 10px rgba(0,0,0,0.25);
      font-size:16px;
    ">
      📍
    </div>
  `,
  className: '',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

export default function BrowseStores() {
  const {
    coords,
    permission,
    requestLocation,
  } = useUserLocation();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (permission !== 'granted') {
      requestLocation().catch(() => {});
    }
  }, [permission, requestLocation]);

  useEffect(() => {
    if (!coords) return;

    setLoading(true);

    getNearbyStores(
      coords.lat,
      coords.lng,
      5
    )
      .then((res) => {
        setStores(
          res.data.stores ||
            res.data ||
            []
        );
      })
      .catch(() => {
        setStores([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coords]);

  const filtered = useMemo(() => {
    const search = query
      .trim()
      .toLowerCase();

    if (!search) return stores;

    return stores.filter((store) =>
      store.storeName
        ?.toLowerCase()
        .includes(search)
    );
  }, [stores, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-7">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
              <Store className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Local shopping
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Browse verified stores
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-xl">
            Discover trusted local stores near you and shop
            from businesses in your area.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search stores..."
              className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-text-muted hover:text-text-primary"
              >
                Clear
              </button>
            )}
          </div>

          {/* View switcher */}
          <div className="flex items-center bg-input border border-border rounded-xl p-1 self-start">

            <button
              type="button"
              onClick={() => setView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                view === 'grid'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid
            </button>

            <button
              type="button"
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                view === 'map'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Map view"
            >
              <MapIcon className="w-3.5 h-3.5" />
              Map
            </button>

          </div>
        </div>
      </div>

      {/* Location state */}
      {permission !== 'granted' ? (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <EmptyState
            icon={MapIcon}
            title="Share your location"
            description="We use your location only to find verified stores close to you."
          />

          <div className="flex justify-center pb-6">
            <button
              type="button"
              onClick={() =>
                requestLocation().catch(() => {})
              }
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Navigation className="w-3.5 h-3.5" />
              Use my location
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-card border border-border rounded-card shadow-sm p-12 text-center">
          <div className="w-9 h-9 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-medium text-text-primary">
            Finding stores near you
          </p>

          <p className="text-xs text-text-muted mt-1">
            Searching within 5 km of your location.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={Search}
            title={
              query
                ? 'No stores found'
                : 'No verified stores nearby'
            }
            description={
              query
                ? 'Try a different store name or clear your search.'
                : 'There are currently no verified stores available in your area.'
            }
          />
        </div>
      ) : view === 'grid' ? (
        <>
          {/* Result summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-text-muted">
              Showing{' '}
              <span className="font-semibold text-text-primary">
                {filtered.length}
              </span>{' '}
              store
              {filtered.length !== 1 ? 's' : ''}
              {query && (
                <>
                  {' '}
                  matching{' '}
                  <span className="font-semibold text-text-primary">
                    "{query}"
                  </span>
                </>
              )}
            </p>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="w-3.5 h-3.5" />
              Within 5 km
            </div>
          </div>

          {/* Store grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map((store, index) => (
              <FadeIn
                key={store._id}
                delay={Math.min(index, 8) * 0.05}
              >
                <StoreCard store={store} />
              </FadeIn>
            ))}
          </div>
        </>
      ) : (
        /* Map */
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          {/* Map header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Stores near you
              </h2>

              <p className="text-[11px] text-text-muted mt-0.5">
                {filtered.length} location
                {filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                You
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Store
              </span>
            </div>
          </div>

          <div className="h-[520px] sm:h-[580px]">
            <MapContainer
              center={[
                coords.lat,
                coords.lng,
              ]}
              zoom={13}
              style={{
                height: '100%',
                width: '100%',
              }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {/* Customer */}
              <Marker
                position={[
                  coords.lat,
                  coords.lng,
                ]}
                icon={customerIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">
                      You are here
                    </p>

                    <p className="text-xs text-text-muted mt-1">
                      Your current location
                    </p>
                  </div>
                </Popup>
              </Marker>

              {/* Stores */}
              {filtered.map((store) => {
                const coordinates =
                  store.location?.coordinates;

                if (
                  !Array.isArray(coordinates) ||
                  coordinates.length < 2
                ) {
                  return null;
                }

                return (
                  <Marker
                    key={store._id}
                    position={[
                      coordinates[1],
                      coordinates[0],
                    ]}
                    icon={storeIcon}
                  >
                    <Popup>
                      <div className="min-w-[180px] text-sm">

                        <p className="font-semibold text-text-primary">
                          {store.storeName}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <VerifiedBadge />

                          <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
                            <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />

                            {store.rating?.toFixed(1) ??
                              'New'}
                          </span>
                        </div>

                        {store.category && (
                          <p className="text-xs text-text-muted mt-1.5">
                            {store.category}
                          </p>
                        )}

                        {typeof store.distanceKm ===
                          'number' && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-accent font-medium">
                            <MapPin className="w-3 h-3" />
                            {formatDistance(
                              store.distanceKm
                            )}{' '}
                            away
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
}