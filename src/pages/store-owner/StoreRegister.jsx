import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Store, MapPin, FileCheck2, ClipboardCheck, Search } from 'lucide-react';
import Button from '../../components/common/Button';
import { useUserLocation } from '../../hooks/useLocation';
import { registerStore } from '../../services/storeService';
import { searchAddress } from '../../services/geocodingService';

const pinIcon = L.divIcon({
  html: `<div style="background:#00C896;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:15px">🏪</div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function ClickToPin({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng) });
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

const categories = ['Grocery', 'Dairy', 'Fruits & Veg', 'Bakery', 'Beverages', 'Household', 'Snacks', 'Personal Care'];

const stepMeta = [
  { icon: Store, label: 'Basic info' },
  { icon: MapPin, label: 'Location' },
  { icon: FileCheck2, label: 'Documents' },
  { icon: ClipboardCheck, label: 'Review' },
];

export default function StoreRegister() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { coords, requestLocation } = useUserLocation();
  const navigate = useNavigate();

  const [mapCenter, setMapCenter] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [form, setForm] = useState({
    storeName: '', ownerName: '', email: '', phone: '', category: categories[0],
    street: '', city: '', state: '', pincode: '',
    pin: null,
    aadhaarCard: null, shopLicense: null,
  });

  useEffect(() => {
    if (!coords) requestLocation().catch(() => {});
  }, []);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      toast.error('Type at least 3 characters to search');
      return;
    }
    setSearching(true);
    setResults([]);
    try {
      const { data } = await searchAddress(query.trim(), 'stores');
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
    update({ pin: picked });
    setMapCenter(picked);
    setResults([]);
    setQuery(result.displayName);
  };

  const canNext = () => {
    if (step === 0) return form.storeName && form.ownerName && form.email && form.phone;
    if (step === 1) return form.street && form.city && form.pin;
    if (step === 2) return form.aadhaarCard && form.shopLicense;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'pin') fd.append('coordinates', JSON.stringify([val.lng, val.lat]));
        else if (val instanceof File) fd.append(key, val);
        else fd.append(key, val ?? '');
      });
      await registerStore(fd);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit your registration.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-5">
          <ClipboardCheck className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Your store is under review</h1>
        <p className="text-sm text-text-secondary mt-2 mb-8">
          You'll be notified as soon as an admin approves your documents — usually within a couple of days.
        </p>
        <Button onClick={() => navigate('/')}>Back to home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Register your store</h1>
      <p className="text-sm text-text-secondary mb-8">Get verified and start selling to nearby customers.</p>

      <div className="flex items-center mb-8">
        {stepMeta.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= step ? 'bg-accent text-white' : 'bg-input text-text-muted'}`}>
                <s.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] text-text-muted w-16 text-center">{s.label}</span>
            </div>
            {i < stepMeta.length - 1 && <div className={`flex-1 h-0.5 mx-1 -mt-4 ${i < step ? 'bg-accent' : 'bg-input'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-card shadow-sm p-6">
        {step === 0 && (
          <div className="space-y-4">
            <input placeholder="Store name" value={form.storeName} onChange={(e) => update({ storeName: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <input placeholder="Owner name" value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => update({ phone: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <select value={form.category} onChange={(e) => update({ category: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input placeholder="Street address" value={form.street} onChange={(e) => update({ street: e.target.value })} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="City" value={form.city} onChange={(e) => update({ city: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <input placeholder="State" value={form.state} onChange={(e) => update({ state: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
              <input placeholder="Pincode" value={form.pincode} onChange={(e) => update({ pincode: e.target.value })} className="bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent" />
            </div>
            <p className="text-xs text-text-muted">Search your address, or tap the map to pin your store's exact location.</p>
            <div className="relative">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                  placeholder="Search for your store's address..."
                  className="flex-1 bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
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
            <div className="h-56 rounded-lg overflow-hidden border border-border">
              {coords && (
                <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                  <ClickToPin onPick={(latlng) => { update({ pin: latlng }); setMapCenter(null); }} />
                  <RecenterMap center={mapCenter} />
                  {form.pin && <Marker position={form.pin} icon={pinIcon} />}
                </MapContainer>
              )}
            </div>
            <div className="text-xs font-nums bg-input border border-border rounded-lg px-3 py-2 text-text-secondary">
              {form.pin ? (
                <>
                  <span className="font-semibold text-text-primary">Pinned:</span>{' '}
                  lat {form.pin.lat.toFixed(6)}, lng {form.pin.lng.toFixed(6)}
                </>
              ) : (
                'No pin set yet — tap the map or search above.'
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-1.5 block">Aadhaar card</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => update({ aadhaarCard: e.target.files[0] })} className="w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-sm file:font-semibold" />
            </div>
            <div>
              <label className="text-sm font-medium text-text-primary mb-1.5 block">Shop license</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => update({ shopLicense: e.target.files[0] })} className="w-full text-sm text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-sm file:font-semibold" />
            </div>
            <p className="text-xs text-text-muted">
              These are visible only to Trustore admins during verification — never shown to customers.
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <p><span className="text-text-muted">Store:</span> {form.storeName} ({form.category})</p>
            <p><span className="text-text-muted">Owner:</span> {form.ownerName} • {form.phone}</p>
            <p><span className="text-text-muted">Address:</span> {form.street}, {form.city}, {form.state} {form.pincode}</p>
            <p className="font-nums">
              <span className="text-text-muted font-body">Coordinates:</span>{' '}
              {form.pin ? `${form.pin.lat.toFixed(6)}, ${form.pin.lng.toFixed(6)}` : 'not set'}
            </p>
            <p><span className="text-text-muted">Documents:</span> {form.aadhaarCard?.name}, {form.shopLicense?.name}</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
          {step < 3 ? (
            <Button disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button loading={submitting} onClick={handleSubmit}>
              Submit for review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}