import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import toast from 'react-hot-toast';
import {
  Trash2,
  Star,
  Plus,
  Search,
  MapPin,
  Pencil,
  Home,
  Briefcase,
  MapPinned,
  Check,
  AlertCircle,
} from 'lucide-react';

import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { searchAddress } from '../../services/geocodingService';
import { useUserLocation } from '../../hooks/useLocation';

const pinIcon = L.divIcon({
  html: `
    <div style="
      background:#F97316;
      width:28px;
      height:28px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      font-size:14px
    ">
      📍
    </div>
  `,
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

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);

  return null;
}

const emptyForm = {
  label: 'Home',
  street: '',
  city: '',
  state: '',
  pincode: '',
};

const getAddressIcon = (label) => {
  const value = label?.toLowerCase();

  if (value === 'work' || value === 'office') {
    return Briefcase;
  }

  return Home;
};

const formatAddress = (address) =>
  address?.fullAddress ||
  [
    address?.street,
    address?.city,
    address?.state,
    address?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [defaultId, setDefaultId] = useState(null);

  const [pin, setPin] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const { coords, requestLocation } = useUserLocation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    api
      .get('/addresses')
      .then((res) => {
        setAddresses(
          res.data.addresses ||
            res.data ||
            []
        );
      })
      .catch(() => {
        setAddresses([]);
        toast.error('Could not load your addresses.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (modalOpen && !coords) {
      requestLocation().catch(() => {});
    }
  }, [modalOpen, coords, requestLocation]);

  const resetModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPin(null);
    setMapCenter(null);
    setQuery('');
    setResults([]);
    setSearching(false);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    resetModal();
  };

  const openAddModal = () => {
    resetModal();
    setModalOpen(true);
  };

  const openEditModal = (address) => {
    const coordinates =
      address?.location?.coordinates;

    const existingPin =
      Array.isArray(coordinates) &&
      coordinates.length >= 2
        ? {
            lng: Number(coordinates[0]),
            lat: Number(coordinates[1]),
          }
        : null;

    setEditingId(address._id);

    setForm({
      label: address.label || 'Home',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
    });

    setPin(existingPin);
    setMapCenter(existingPin);
    setQuery(address.fullAddress || '');
    setResults([]);
    setModalOpen(true);
  };

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      toast.error(
        'Type at least 3 characters to search'
      );
      return;
    }

    setSearching(true);
    setResults([]);

    try {
      const { data } = await searchAddress(
        query.trim(),
        'addresses'
      );

      if (!data.results?.length) {
        toast.error(
          'No matches found — try a different search or tap the map instead'
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

    setPin(picked);
    setMapCenter(picked);
    setResults([]);
    setQuery(result.displayName);

    // Try to populate available address fields
    // without overwriting fields with undefined values.
    setForm((current) => ({
      ...current,
      street:
        result.street ||
        result.address ||
        current.street,
      city:
        result.city ||
        current.city,
      state:
        result.state ||
        current.state,
      pincode:
        result.pincode ||
        current.pincode,
    }));
  };

  const handleSave = async () => {
    if (!form.label.trim()) {
      toast.error('Add a label for this address.');
      return;
    }

    if (!form.street.trim()) {
      toast.error('Enter your street address.');
      return;
    }

    if (!form.city.trim()) {
      toast.error('Enter your city.');
      return;
    }

    if (!form.pincode.trim()) {
      toast.error('Enter your pincode.');
      return;
    }

    if (!pin) {
      toast.error(
        'Search your address or tap the map to drop a pin'
      );
      return;
    }

    setSaving(true);

    const payload = {
      ...form,
      label: form.label.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
      location: {
        type: 'Point',
        coordinates: [pin.lng, pin.lat],
      },
    };

    try {
      if (editingId) {
        const { data } = await api.put(
          `/addresses/${editingId}`,
          payload
        );

        const updated =
          data.address || data;

        setAddresses((prev) =>
          prev.map((address) =>
            address._id === editingId
              ? updated
              : address
          )
        );

        toast.success('Address updated');
      } else {
        const { data } = await api.post(
          '/addresses',
          payload
        );

        setAddresses((prev) => [
          ...prev,
          data.address || data,
        ]);

        toast.success('Address saved');
      }

      setModalOpen(false);
      resetModal();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Could not ${
            editingId ? 'update' : 'save'
          } this address.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const address = addresses.find(
      (item) => item._id === id
    );

    const confirmed = window.confirm(
      `Delete "${address?.label || 'this address'}"?\n\nThis address will be permanently removed.`
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await api.delete(`/addresses/${id}`);

      setAddresses((prev) =>
        prev.filter(
          (address) => address._id !== id
        )
      );

      toast.success('Address removed');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not remove this address.'
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    setDefaultId(id);

    try {
      await api.put(
        `/addresses/${id}/set-default`
      );

      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address._id === id,
        }))
      );

      toast.success('Default address updated');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update your default address.'
      );
    } finally {
      setDefaultId(null);
    }
  };

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading your addresses..."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
              <MapPinned className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Delivery details
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Your addresses
          </h1>

          <p className="text-sm text-text-muted mt-1.5">
            Save your delivery locations for a faster checkout.
          </p>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
        >
          <Plus className="w-4 h-4" />
          Add address
        </Button>
      </div>

      {/* Address count */}
      {addresses.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-text-muted">
            {addresses.length}{' '}
            saved address
            {addresses.length !== 1 ? 'es' : ''}
          </p>

          {addresses.some(
            (address) => address.isDefault
          ) && (
            <div className="inline-flex items-center gap-1.5 text-xs text-accent">
              <Check className="w-3.5 h-3.5" />
              Default address selected
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {addresses.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
          <EmptyState
            icon={MapPin}
            title="No saved addresses"
            description="Add your home, work, or another delivery location so checkout only takes a tap."
          />

          <div className="px-6 pb-6 flex justify-center">
            <Button
              size="sm"
              onClick={openAddModal}
            >
              <Plus className="w-4 h-4" />
              Add your first address
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">

          {addresses.map((address) => {
            const AddressIcon = getAddressIcon(
              address.label
            );

            const isDeleting =
              deletingId === address._id;

            const isSettingDefault =
              defaultId === address._id;

            return (
              <div
                key={address._id}
                className={`bg-card border rounded-card shadow-sm p-4 sm:p-5 transition-all ${
                  address.isDefault
                    ? 'border-accent/30'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3.5">

                  {/* Address icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      address.isDefault
                        ? 'bg-accent-soft'
                        : 'bg-surface'
                    }`}
                  >
                    <AddressIcon
                      className={`w-4 h-4 ${
                        address.isDefault
                          ? 'text-accent'
                          : 'text-text-muted'
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-text-primary">
                        {address.label ||
                          'Address'}
                      </span>

                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-accent-soft text-accent px-2 py-0.5 rounded-full font-semibold">
                          <Check className="w-2.5 h-2.5" />
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                      {formatAddress(address)}
                    </p>

                    {!address.isDefault && (
                      <button
                        type="button"
                        onClick={() =>
                          handleSetDefault(
                            address._id
                          )
                        }
                        disabled={
                          isSettingDefault ||
                          isDeleting
                        }
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-text-muted hover:text-accent transition-colors disabled:opacity-50"
                      >
                        <Star className="w-3.5 h-3.5" />

                        {isSettingDefault
                          ? 'Setting default...'
                          : 'Set as default'}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">

                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(address)
                      }
                      disabled={
                        isDeleting ||
                        isSettingDefault
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent hover:bg-accent-soft transition-colors disabled:opacity-40"
                      aria-label="Edit address"
                      title="Edit address"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(address._id)
                      }
                      disabled={
                        isDeleting ||
                        isSettingDefault
                      }
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-accent-red hover:bg-accent-red/10 transition-colors disabled:opacity-40"
                      aria-label="Delete address"
                      title="Delete address"
                    >
                      {isDeleting ? (
                        <span className="w-3.5 h-3.5 border-2 border-text-muted border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          editingId
            ? 'Edit address'
            : 'Add a new address'
        }
        maxWidth="max-w-xl"
      >
        <div className="space-y-5">

          {/* Modal intro */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface border border-border">
            <MapPinned className="w-4 h-4 text-accent mt-0.5 shrink-0" />

            <div>
              <p className="text-xs font-semibold text-text-primary">
                Set your delivery location
              </p>

              <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                Search for your address or tap directly on
                the map to place the delivery pin.
              </p>
            </div>
          </div>

          {/* Address label */}
          <div>
            <label className="text-xs font-semibold text-text-primary mb-1.5 block">
              Address label
            </label>

            <div className="grid grid-cols-3 gap-2">
              {['Home', 'Work', 'Other'].map(
                (label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        label,
                      })
                    }
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-colors ${
                      form.label === label
                        ? 'border-accent bg-accent-soft text-accent'
                        : 'border-border text-text-secondary hover:border-accent/40'
                    }`}
                  >
                    {label === 'Home' ? (
                      <Home className="w-3.5 h-3.5" />
                    ) : label === 'Work' ? (
                      <Briefcase className="w-3.5 h-3.5" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5" />
                    )}

                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Address fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-primary mb-1.5 block">
                Street address
              </label>

              <input
                value={form.street}
                onChange={(e) =>
                  setForm({
                    ...form,
                    street: e.target.value,
                  })
                }
                placeholder="House / building / street"
                className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>
                <label className="text-xs font-semibold text-text-primary mb-1.5 block">
                  City
                </label>

                <input
                  value={form.city}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      city: e.target.value,
                    })
                  }
                  placeholder="City"
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary mb-1.5 block">
                  State
                </label>

                <input
                  value={form.state}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      state: e.target.value,
                    })
                  }
                  placeholder="State"
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-text-primary mb-1.5 block">
                  Pincode
                </label>

                <input
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pincode: e.target.value,
                    })
                  }
                  placeholder="400001"
                  inputMode="numeric"
                  className="w-full bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-text-primary">
                Pin your location
              </label>

              {pin && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent">
                  <Check className="w-3 h-3" />
                  Location pinned
                </span>
              )}
            </div>

            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

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
                    placeholder="Search your address..."
                    className="w-full bg-input border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  loading={searching}
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Search results */}
              {results.length > 0 && (
                <div className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">

                  {results.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handlePickResult(result)
                      }
                      className="w-full text-left px-3.5 py-3 text-xs text-text-secondary hover:bg-surface hover:text-text-primary transition-colors border-b border-border last:border-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />

                        <span>
                          {result.displayName}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="h-64 sm:h-72 rounded-xl overflow-hidden border border-border">
              {coords ? (
                <MapContainer
                  center={[
                    pin?.lat ||
                      coords.lat,
                    pin?.lng ||
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
                      setPin(latlng);
                      setMapCenter(null);
                    }}
                  />

                  <RecenterMap
                    center={mapCenter}
                  />

                  {pin && (
                    <Marker
                      position={pin}
                      icon={pinIcon}
                    />
                  )}
                </MapContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center bg-surface">
                  <MapPin className="w-6 h-6 text-text-muted mb-2" />

                  <p className="text-xs text-text-muted">
                    Waiting for your location...
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 mt-2">
              <AlertCircle className="w-3.5 h-3.5 text-text-muted mt-0.5 shrink-0" />

              <p className="text-[11px] text-text-muted leading-relaxed">
                Search for your address or tap the map to
                place the delivery pin exactly where you want
                your order delivered.
              </p>
            </div>
          </div>

          {/* Coordinates */}
          {pin && (
            <div className="text-[11px] font-nums bg-input border border-border rounded-lg px-3 py-2.5 text-text-secondary">
              <span className="font-semibold text-text-primary">
                Pinned location:
              </span>{' '}
              {pin.lat.toFixed(6)}, {pin.lng.toFixed(6)}
            </div>
          )}

          {/* Save */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={closeModal}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              loading={saving}
              onClick={handleSave}
            >
              <Check className="w-4 h-4" />

              {editingId
                ? 'Save changes'
                : 'Save address'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}