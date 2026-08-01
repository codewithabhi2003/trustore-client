import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trash2, Star, Plus, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { searchAddress } from '../../services/geocodingService';
import { useUserLocation } from '../../hooks/useLocation';

const pinIcon = L.divIcon({
  html: `<div style="background:#F97316;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:14px">📍</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function ClickToPin({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng);
    },
  });
  return null;
}

// react-leaflet's MapContainer only reads `center` on first mount, so a geocode result
// needs this to actually pan the already-mounted map to the new coordinates.
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 16);
  }, [center, map]);
  return null;
}

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pin, setPin] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [form, setForm] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' });
  const { coords, requestLocation } = useUserLocation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api
      .get('/addresses')
      .then((res) => setAddresses(res.data.addresses || res.data || []))
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (modalOpen && !coords) requestLocation().catch(() => {});
  }, [modalOpen]);

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      toast.error('Type at least 3 characters to search');
      return;
    }
    setSearching(true);
    setResults([]);
    try {
      const { data } = await searchAddress(query.trim(), 'addresses');
      if (!data.results?.length) {
        toast.error('No matches found — try a different search or tap the map instead');
      }
      setResults(data.results || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not search for that address right now.');
    } finally {
      setSearching(false);
    }
  };

  const handlePickResult = (result) => {
    const picked = { lat: result.lat, lng: result.lng };
    setPin(picked);
    setMapCenter(picked);
    setResults([]);
    setQuery(result.displayName);
  };

  const handleSave = async () => {
    if (!pin) {
      toast.error('Search your address or tap the map to drop a pin');
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.post('/addresses', {
        ...form,
        location: { type: 'Point', coordinates: [pin.lng, pin.lat] },
      });
      setAddresses((prev) => [...prev, data.address || data]);
      setModalOpen(false);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save this address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch {
      toast.error('Could not remove this address.');
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}/set-default`);
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a._id === id })));
    } catch {
      toast.error('Could not update your default address.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">Your addresses</h1>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add address
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-text-muted">Loading...</p>
      ) : addresses.length === 0 ? (
        <EmptyState title="No saved addresses" description="Add one so checkout only takes a tap." />
      ) : (
        <div className="space-y-3">
          {addresses.map((a) => (
            <div key={a._id} className="bg-card border border-border rounded-card shadow-sm p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary">{a.label}</span>
                  {a.isDefault && (
                    <span className="text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded-full font-semibold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-0.5">
                  {a.fullAddress || `${a.street}, ${a.city}, ${a.state} ${a.pincode}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!a.isDefault && (
                  <button onClick={() => handleSetDefault(a._id)} className="text-text-muted hover:text-accent-yellow" aria-label="Set as default">
                    <Star className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => handleDelete(a._id)} className="text-text-muted hover:text-accent-red" aria-label="Delete address">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add a new address" maxWidth="max-w-xl">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            placeholder="Label (Home, Work...)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="col-span-2 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="col-span-2 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <input
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <p className="text-xs text-text-muted mb-2">
          Search your address to find it on the map, or tap the map directly to drop a pin.
        </p>
        <div className="relative mb-3">
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
              placeholder="Search for your address..."
              className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <Button size="sm" variant="secondary" loading={searching} onClick={handleSearch}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          {results.length > 0 && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-md max-h-48 overflow-y-auto">
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handlePickResult(r)}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors border-b border-border last:border-0"
                >
                  {r.displayName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-64 rounded-lg overflow-hidden border border-border mb-4">
          {coords && (
            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <ClickToPin onPick={(latlng) => { setPin(latlng); setMapCenter(null); }} />
              <RecenterMap center={mapCenter} />
              {pin && <Marker position={pin} icon={pinIcon} />}
            </MapContainer>
          )}
        </div>

        <Button className="w-full" loading={saving} onClick={handleSave}>
          Save address
        </Button>
      </Modal>
    </div>
  );
}
