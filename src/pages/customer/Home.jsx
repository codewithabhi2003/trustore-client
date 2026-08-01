import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPinned, Store, ShoppingBag, ArrowRight, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import StoreCard from '../../components/store/StoreCard';
import { useUserLocation } from '../../hooks/useLocation';
import { getNearbyStores } from '../../services/storeService';

const steps = [
  { icon: '📋', title: 'Paste your grocery list', desc: 'Type it however feels natural — no forms, no dropdowns.' },
  { icon: '🤖', title: 'AI extracts products', desc: 'Groq reads your list and structures it in seconds.' },
  { icon: '🗺️', title: 'Smart cluster selected', desc: 'We group nearby verified stores and pick the best combination.' },
  { icon: '🛒', title: 'Order placed in seconds', desc: 'Checkout once, even if items come from a couple of stores.' },
];

const categories = ['Grocery', 'Dairy', 'Fruits & Veg', 'Bakery', 'Beverages', 'Household', 'Snacks', 'Personal Care'];

export default function Home() {
  const { coords, permission, requesting, requestLocation } = useUserLocation();
  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);

  useEffect(() => {
    if (!coords) return;
    setLoadingStores(true);
    getNearbyStores(coords.lat, coords.lng)
      .then((res) => setStores(res.data.stores || res.data || []))
      .catch(() => setStores([]))
      .finally(() => setLoadingStores(false));
  }, [coords]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-soft via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent bg-accent-soft px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> AI-powered hyperlocal grocery
            </span>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold leading-tight text-text-primary">
              Shop only from <span className="text-accent">trusted local stores</span>.
            </h1>
            <p className="text-text-secondary text-lg mt-5 max-w-lg">
              Tell Trustore what you need in plain language. We match you to the best cluster of
              admin-verified stores near you — no scrolling through catalogs.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/shop-ai">
                <Button size="lg">
                  <Sparkles className="w-4 h-4" /> Shop with AI
                </Button>
              </Link>
              <Link to="/stores">
                <Button variant="secondary" size="lg">
                  Browse stores
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location prompt */}
      {permission !== 'granted' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
          <div className="bg-card border border-border rounded-card shadow-md p-5 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                <MapPinned className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm text-text-primary font-medium">
                Allow location to discover verified stores near you
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button size="sm" loading={requesting} onClick={requestLocation}>
                Allow location access
              </Button>
              <Link to="/addresses">
                <Button size="sm" variant="ghost">Enter manually</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Nearby stores */}
      {permission === 'granted' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-heading font-bold text-text-primary">
              {stores.length > 0 ? `${stores.length} verified stores near you` : 'Verified stores near you'}
            </h2>
            <Link to="/stores" className="text-sm font-semibold text-accent inline-flex items-center gap-1">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loadingStores ? (
            <p className="text-sm text-text-muted">Looking for stores near you...</p>
          ) : stores.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
              {stores.map((s) => (
                <StoreCard key={s._id} store={s} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> No verified stores in your area yet.
            </p>
          )}
        </section>
      )}

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-8">How Trustore works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-card p-5 shadow-sm">
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="font-heading font-bold text-text-primary text-sm mb-1">{s.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-6">Popular categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/stores?category=${encodeURIComponent(c)}`}
              className="px-5 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Stats banner */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: Store, label: 'verified stores', value: '250+' },
            { icon: ShoppingBag, label: 'products listed', value: '12,000+' },
            { icon: MapPin, label: 'cities covered', value: '8' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <Icon className="w-5 h-5 text-accent mb-2" />
              <div className="text-2xl sm:text-3xl font-nums font-extrabold text-text-primary">{value}</div>
              <div className="text-xs text-text-muted mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
