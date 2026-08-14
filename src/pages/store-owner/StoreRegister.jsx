import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import {
  Store,
  MapPin,
  FileCheck2,
  ClipboardCheck,
  Search,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  ShieldCheck,
} from 'lucide-react';

import Button from '../../components/common/Button';
import { useUserLocation } from '../../hooks/useLocation';
import { registerStore } from '../../services/storeService';
import { searchAddress } from '../../services/geocodingService';

const pinIcon = L.divIcon({
  html: `
    <div style="
      background:#00C896;
      width:30px;
      height:30px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      font-size:15px;
    ">
      🏪
    </div>
  `,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

function ClickToPin({ onPick }) {
  useMapEvents({
    click: (e) => onPick(e.latlng),
  });

  return null;
}

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

const categories = [
  'Grocery',
  'Dairy',
  'Fruits & Veg',
  'Bakery',
  'Beverages',
  'Household',
  'Snacks',
  'Personal Care',
];

const stepMeta = [
  {
    icon: Store,
    label: 'Basic info',
    description: 'Store details',
  },
  {
    icon: MapPin,
    label: 'Location',
    description: 'Store location',
  },
  {
    icon: FileCheck2,
    label: 'Documents',
    description: 'Verification',
  },
  {
    icon: ClipboardCheck,
    label: 'Review',
    description: 'Submit details',
  },
];

function Field({
  label,
  optional = false,
  children,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-text-secondary mb-1.5 block">
        {label}

        {optional && (
          <span className="text-text-muted font-normal ml-1">
            (optional)
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputClass =
  'w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors';

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
    storeName: '',
    ownerName: '',
    email: '',
    phone: '',
    category: categories[0],
    street: '',
    city: '',
    state: '',
    pincode: '',
    pin: null,
    aadhaarCard: null,
    shopLicense: null,
    logo: null,
  });

  useEffect(() => {
    if (!coords) {
      requestLocation().catch(() => {});
    }
  }, []);

  const update = (patch) => {
    setForm((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      toast.error('Type at least 3 characters to search');
      return;
    }

    setSearching(true);
    setResults([]);

    try {
      const { data } = await searchAddress(
        query.trim(),
        'stores'
      );

      if (!data.results?.length) {
        toast.error(
          'No matches found — try another search or tap the map'
        );
      }

      setResults(data.results || []);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not search for that address right now.'
      );
    } finally {
      setSearching(false);
    }
  };

  const handlePickResult = (result) => {
    const picked = {
      lat: result.lat,
      lng: result.lng,
    };

    update({
      pin: picked,
    });

    setMapCenter(picked);
    setResults([]);
    setQuery(result.displayName);
  };

  const canNext = () => {
    if (step === 0) {
      return (
        form.storeName &&
        form.ownerName &&
        form.email &&
        form.phone
      );
    }

    if (step === 1) {
      return (
        form.street &&
        form.city &&
        form.pin
      );
    }

    if (step === 2) {
      return (
        form.aadhaarCard &&
        form.shopLicense
      );
    }

    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'pin') {
          if (value) {
            fd.append(
              'coordinates',
              JSON.stringify([
                value.lng,
                value.lat,
              ])
            );
          }
        } else if (value instanceof File) {
          fd.append(key, value);
        } else {
          fd.append(key, value ?? '');
        }
      });

      await registerStore(fd);

      setSubmitted(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not submit your registration.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
        <div className="bg-card border border-border rounded-card shadow-sm p-8 text-center">

          <div className="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-5">
            <ClipboardCheck className="w-8 h-8 text-accent" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent mb-3">
            <Check className="w-3 h-3" />
            Registration submitted
          </span>

          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Your store is under review
          </h1>

          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Your store information and documents have been
            submitted successfully. You'll be notified once an
            admin completes the verification.
          </p>

          <div className="flex items-start gap-3 text-left bg-surface border border-border rounded-xl p-4 mt-6 mb-7">
            <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />

            <p className="text-xs text-text-muted leading-relaxed">
              Your verification documents are reviewed only by
              Trustore administrators and aren't displayed to
              customers.
            </p>
          </div>

          <Button
            className="w-full"
            onClick={() => navigate('/')}
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const currentStep = stepMeta[step];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Store className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Store onboarding
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Register your store
        </h1>

        <p className="text-sm text-text-muted mt-1.5 max-w-xl">
          Get verified and start selling to customers near your
          store.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5 mb-5">
        <div className="flex items-center">
          {stepMeta.map((item, index) => {
            const Icon = item.icon;
            const completed = index < step;
            const active = index === step;

            return (
              <div
                key={item.label}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                      completed
                        ? 'bg-accent text-white'
                        : active
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-surface text-text-muted border border-border'
                    }`}
                  >
                    {completed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>

                  <span
                    className={`text-[10px] mt-1.5 text-center hidden sm:block ${
                      active
                        ? 'text-text-primary font-semibold'
                        : 'text-text-muted'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {index < stepMeta.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 ${
                      index < step
                        ? 'bg-accent'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile step label */}
        <div className="sm:hidden mt-4 pt-3 border-t border-border">
          <p className="text-xs font-semibold text-text-primary">
            Step {step + 1} of {stepMeta.length}
          </p>

          <p className="text-[11px] text-text-muted mt-0.5">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        {/* Step header */}
        <div className="px-5 sm:px-6 py-4 border-b border-border bg-surface/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <currentStep.icon className="w-4 h-4 text-accent" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                {currentStep.label}
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                {currentStep.description}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">

          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-4">

              <Field label="Store name">
                <input
                  placeholder="e.g. Vishal Grocery Store"
                  value={form.storeName}
                  onChange={(e) =>
                    update({
                      storeName: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Owner name">
                <input
                  placeholder="Your full name"
                  value={form.ownerName}
                  onChange={(e) =>
                    update({
                      ownerName: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email">
                  <input
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      update({
                        email: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Phone">
                  <input
                    placeholder="10-digit phone number"
                    value={form.phone}
                    onChange={(e) =>
                      update({
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field label="Store category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    update({
                      category: e.target.value,
                    })
                  }
                  className={inputClass}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Store photo */}
              <div className="pt-2">
                <Field
                  label="Store photo"
                  optional
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-input border border-border flex items-center justify-center overflow-hidden shrink-0">
                      {form.logo ? (
                        <img
                          src={URL.createObjectURL(
                            form.logo
                          )}
                          alt="Store preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Store className="w-7 h-7 text-text-muted" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          update({
                            logo:
                              e.target.files?.[0] ||
                              null,
                          })
                        }
                        className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-xs file:font-semibold"
                      />

                      <p className="text-[11px] text-text-muted mt-1.5">
                        Customers will see this on your store
                        card and store page.
                      </p>
                    </div>
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-4">

              <Field label="Street address">
                <input
                  placeholder="Shop no., building, street..."
                  value={form.street}
                  onChange={(e) =>
                    update({
                      street: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="City">
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) =>
                      update({
                        city: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="State">
                  <input
                    placeholder="State"
                    value={form.state}
                    onChange={(e) =>
                      update({
                        state: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </Field>

                <Field label="Pincode">
                  <input
                    placeholder="400001"
                    value={form.pincode}
                    onChange={(e) =>
                      update({
                        pincode: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="bg-surface border border-border rounded-xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />

                  <p className="text-xs text-text-muted leading-relaxed">
                    Search for your address below or tap directly
                    on the map to pin your store's exact location.
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative">
                <div className="flex gap-2">
                  <input
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="Search for your store's address..."
                    className={inputClass}
                  />

                  <Button
                    size="sm"
                    variant="secondary"
                    loading={searching}
                    onClick={handleSearch}
                    className="px-3"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {results.length > 0 && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-52 overflow-y-auto">
                    {results.map((result, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() =>
                          handlePickResult(result)
                        }
                        className="w-full text-left px-4 py-3 text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-colors border-b border-border last:border-0"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />

                          <span>
                            {result.displayName}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border border-border bg-surface">
                <div className="h-64 sm:h-72">
                  {coords ? (
                    <MapContainer
                      center={[
                        coords.lat,
                        coords.lng,
                      ]}
                      zoom={15}
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />

                      <ClickToPin
                        onPick={(latlng) => {
                          update({
                            pin: latlng,
                          });
                          setMapCenter(null);
                        }}
                      />

                      <RecenterMap
                        center={mapCenter}
                      />

                      {form.pin && (
                        <Marker
                          position={form.pin}
                          icon={pinIcon}
                        />
                      )}
                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-6 h-6 text-text-muted mx-auto mb-2" />

                        <p className="text-xs text-text-muted">
                          Waiting for your location...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Coordinates */}
              <div
                className={`rounded-xl border px-3.5 py-3 text-xs ${
                  form.pin
                    ? 'bg-accent/5 border-accent/20 text-text-secondary'
                    : 'bg-input border-border text-text-muted'
                }`}
              >
                {form.pin ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-accent shrink-0" />

                    <span>
                      <span className="font-semibold text-text-primary">
                        Store location pinned
                      </span>{' '}
                      ·{' '}
                      <span className="font-nums">
                        {form.pin.lat.toFixed(6)},{' '}
                        {form.pin.lng.toFixed(6)}
                      </span>
                    </span>
                  </div>
                ) : (
                  'No location pinned yet — search above or tap the map.'
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-4">

              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />

                  <div>
                    <p className="text-xs font-semibold text-text-primary">
                      Verification documents
                    </p>

                    <p className="text-[11px] text-text-muted mt-1 leading-relaxed">
                      These documents are used only for Trustore
                      verification and are not shown to customers.
                    </p>
                  </div>
                </div>
              </div>

              <Field label="Aadhaar card">
                <div className="border border-dashed border-border rounded-xl p-4 hover:border-accent/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4 text-accent" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          update({
                            aadhaarCard:
                              e.target.files?.[0] ||
                              null,
                          })
                        }
                        className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-xs file:font-semibold"
                      />

                      {form.aadhaarCard && (
                        <p className="text-[11px] text-accent mt-1.5 truncate">
                          {form.aadhaarCard.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Field>

              <Field label="Shop license">
                <div className="border border-dashed border-border rounded-xl p-4 hover:border-accent/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Upload className="w-4 h-4 text-accent" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) =>
                          update({
                            shopLicense:
                              e.target.files?.[0] ||
                              null,
                          })
                        }
                        className="w-full text-xs text-text-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-accent-soft file:text-accent file:text-xs file:font-semibold"
                      />

                      {form.shopLicense && (
                        <p className="text-[11px] text-accent mt-1.5 truncate">
                          {form.shopLicense.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Field>
            </div>
          )}

          {/* Step 4 */}
          {step === 3 && (
            <div className="space-y-4">

              <div className="bg-surface border border-border rounded-xl overflow-hidden">

                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-text-primary">
                    Store information
                  </p>
                </div>

                <div className="divide-y divide-border">
                  <div className="px-4 py-3 flex justify-between gap-4">
                    <span className="text-xs text-text-muted">
                      Store
                    </span>

                    <span className="text-xs font-medium text-text-primary text-right">
                      {form.storeName} · {form.category}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between gap-4">
                    <span className="text-xs text-text-muted">
                      Owner
                    </span>

                    <span className="text-xs font-medium text-text-primary text-right">
                      {form.ownerName}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between gap-4">
                    <span className="text-xs text-text-muted">
                      Contact
                    </span>

                    <span className="text-xs font-medium text-text-primary text-right">
                      {form.email} · {form.phone}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between gap-4">
                    <span className="text-xs text-text-muted">
                      Address
                    </span>

                    <span className="text-xs font-medium text-text-primary text-right max-w-xs">
                      {form.street},{' '}
                      {form.city},{' '}
                      {form.state}{' '}
                      {form.pincode}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex justify-between gap-4">
                    <span className="text-xs text-text-muted">
                      Coordinates
                    </span>

                    <span className="text-xs font-nums font-medium text-text-primary text-right">
                      {form.pin
                        ? `${form.pin.lat.toFixed(6)}, ${form.pin.lng.toFixed(6)}`
                        : 'Not set'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">

                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-semibold text-text-primary">
                    Verification files
                  </p>
                </div>

                <div className="divide-y divide-border">
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-text-muted">
                      Aadhaar card
                    </span>

                    <span className="text-xs font-medium text-accent truncate max-w-[60%]">
                      {form.aadhaarCard?.name ||
                        'Not uploaded'}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-text-muted">
                      Shop license
                    </span>

                    <span className="text-xs font-medium text-accent truncate max-w-[60%]">
                      {form.shopLicense?.name ||
                        'Not uploaded'}
                    </span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-text-muted">
                      Store photo
                    </span>

                    <span className="text-xs font-medium text-text-primary truncate max-w-[60%]">
                      {form.logo?.name ||
                        'Not added'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-accent/5 border border-accent/20 rounded-xl p-3.5">
                <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />

                <p className="text-xs text-text-secondary leading-relaxed">
                  Please review your information carefully before
                  submitting. Once submitted, your store will be
                  sent for administrator verification.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-border">
            <Button
              variant="ghost"
              disabled={step === 0 || submitting}
              onClick={() =>
                setStep((current) => current - 1)
              }
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < 3 ? (
              <Button
                disabled={!canNext()}
                onClick={() =>
                  setStep((current) => current + 1)
                }
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                loading={submitting}
                onClick={handleSubmit}
              >
                <ClipboardCheck className="w-4 h-4" />
                Submit for review
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-text-muted text-center mt-5">
        Your information is securely submitted to Trustore for
        store verification.
      </p>
    </div>
  );
}