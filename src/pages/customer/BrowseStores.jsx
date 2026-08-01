import { useEffect, useMemo, useState } from 'react';
import { Search, Map as MapIcon, LayoutGrid, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import StoreCard from '../../components/store/StoreCard';
import VerifiedBadge from '../../components/store/VerifiedBadge';
import EmptyState from '../../components/common/EmptyState';
import { useUserLocation } from '../../hooks/useLocation';
import { getNearbyStores } from '../../services/storeService';
import { formatDistance } from '../../utils/geoUtils';

const storeIcon = L.divIcon({
  html: `<div style="background:#00C896;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px">🏪</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const customerIcon = L.divIcon({
  html: `<div style="background:#F97316;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:16px">📍</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function BrowseStores() {
  const { coords, permission, requestLocation } = useUserLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    if (permission !== 'granted') {
      requestLocation().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!coords) return;
    setLoading(true);
    getNearbyStores(coords.lat, coords.lng, 5)
      .then((res) => setStores(res.data.stores || res.data || []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, [coords]);

  const filtered = useMemo(
    () => stores.filter((s) => s.storeName.toLowerCase().includes(query.toLowerCase())),
    [stores, query]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Browse verified stores</h1>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stores..."
              className="pl-9 pr-4 py-2 bg-input border border-border rounded-full text-sm outline-none focus:border-accent w-48 sm:w-64"
            />
          </div>
          <div className="flex bg-input rounded-full p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-full transition-colors ${view === 'grid' ? 'bg-accent text-white' : 'text-text-secondary'}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('map')}
              className={`p-2 rounded-full transition-colors ${view === 'map' ? 'bg-accent text-white' : 'text-text-secondary'}`}
              aria-label="Map view"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {permission !== 'granted' ? (
        <EmptyState
          icon={MapIcon}
          title="Share your location"
          description="We use it only to find verified stores close to you."
        />
      ) : loading ? (
        <p className="text-sm text-text-muted">Loading nearby stores...</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No stores found"
          description="Try a different search term, or check back as more stores get verified in your area."
        />
      ) : view === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((s) => (
            <StoreCard key={s._id} store={s} />
          ))}
        </div>
      ) : (
        <div className="h-[560px] rounded-card overflow-hidden border border-border">
          <MapContainer center={[coords.lat, coords.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={[coords.lat, coords.lng]} icon={customerIcon}>
              <Popup>You are here</Popup>
            </Marker>
            {filtered.map((s) => (
              <Marker
                key={s._id}
                position={[s.location.coordinates[1], s.location.coordinates[0]]}
                icon={storeIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{s.storeName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <VerifiedBadge />
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-accent-yellow fill-accent-yellow" />
                        {s.rating?.toFixed(1) ?? 'New'}
                      </span>
                    </div>
                    {typeof s.distanceKm === 'number' && (
                      <p className="text-xs text-text-muted mt-1">{formatDistance(s.distanceKm)} away</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
}
