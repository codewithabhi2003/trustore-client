import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  MapPinned,
  ArrowRight,
  MapPin,
  BadgeCheck,
  Map as MapIcon,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import Button from '../../components/common/Button';
import StoreCard from '../../components/store/StoreCard';
import FadeIn from '../../components/common/FadeIn';
import { useUserLocation } from '../../hooks/useLocation';
import { getNearbyStores } from '../../services/storeService';

const steps = [
  { icon: '📋', title: 'Paste your grocery list', desc: 'Type it however feels natural — no forms, no dropdowns.' },
  { icon: '🤖', title: 'AI extracts products', desc: 'Groq reads your list and structures it in seconds.' },
  { icon: '🗺️', title: 'Smart cluster selected', desc: 'We group nearby verified stores and pick the best combination.' },
  { icon: '🛒', title: 'Order placed in seconds', desc: 'Checkout once, even if items come from a couple of stores.' },
];

const categories = ['Grocery', 'Dairy', 'Fruits & Veg', 'Bakery', 'Beverages', 'Household', 'Snacks', 'Personal Care'];

const heroFeatures = [
  { icon: Sparkles, label: 'AI-Powered List Understanding' },
  { icon: MapIcon, label: 'Dynamic Store Clustering' },
  { icon: MapPinned, label: '100m Border Exception' },
  { icon: ShieldCheck, label: 'Admin-Verified Stores' },
];

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
      {/* Hero — full viewport height including behind the floating navbar; colors follow
          the site's light/dark theme instead of being hardcoded dark. */}
      <section className="relative -mt-16 min-h-screen flex items-center overflow-hidden bg-base">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,200,150,0.14),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(0,150,255,0.08),transparent_50%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 relative grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — copy */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              {['AI-Powered', 'Local', 'Verified'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold text-accent bg-accent-soft border border-accent/30 px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="text-4xl sm:text-6xl font-heading font-extrabold leading-[1.05] text-text-primary"
            >
              Shop only from{' '}
              <span className="bg-gradient-to-r from-accent to-emerald-400 bg-clip-text text-transparent">
                trusted local stores
              </span>
              .
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="text-text-secondary text-lg mt-6 max-w-lg"
            >
              Tell Trustore what you need in plain language. We match you to the best cluster of
              admin-verified stores near you — no scrolling through catalogs.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-wrap gap-3 mt-9"
            >
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
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14"
            >
              {heroFeatures.map((f) => (
                <div key={f.label} className="flex flex-col gap-2">
                  <div className="w-9 h-9 rounded-lg bg-elevated border border-border flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-xs text-text-muted leading-snug">{f.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — illustrated preview of the real product, not stock photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-elevated border border-border rounded-3xl p-6 shadow-2xl">
              <div className="bg-input border border-border rounded-2xl px-4 py-3 text-sm text-text-secondary mb-4">
                I need rice, dal, milk, eggs, bread, and some fruits
              </div>

              <div className="relative rounded-2xl border border-accent/40 bg-card p-4 shadow-glow">
                <div className="inline-flex items-center gap-1.5 bg-accent text-[#08150f] text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">
                  <Trophy className="w-3 h-3" /> Best match
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-text-primary font-heading font-bold text-sm">Cluster A</p>
                    <p className="text-text-muted text-xs mt-0.5">6 of 6 products • 300m away</p>
                  </div>
                  <span className="text-2xl font-nums font-extrabold text-accent">97</span>
                </div>
                <div className="space-y-1.5">
                  {[100, 94, 93].map((v, i) => (
                    <div key={i} className="h-1.5 rounded-full bg-input overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${v}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -right-5 top-10 bg-card text-text-primary rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-border"
              >
                <BadgeCheck className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold">Verified stores only</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location prompt */}
      {permission !== 'granted' && (
        <FadeIn>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
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
        </FadeIn>
      )}

      {/* Nearby stores */}
      {permission === 'granted' && (
        <FadeIn>
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
        </FadeIn>
      )}

      {/* How it works */}
      <FadeIn>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <h2 className="text-2xl font-heading font-bold text-text-primary mb-8">How Trustore works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-card border border-border rounded-card p-5 shadow-sm h-full">
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <h3 className="font-heading font-bold text-text-primary text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Categories */}
      <FadeIn>
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
      </FadeIn>
    </div>
  );
}