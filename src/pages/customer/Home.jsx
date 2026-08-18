import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Sparkles,
  MapPinned,
  ArrowRight,
  MapPin,
  BadgeCheck,
  Search,
  ShoppingBag,
  Store,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";

import Button from "../../components/common/Button";
import StoreCard from "../../components/store/StoreCard";
import FadeIn from "../../components/common/FadeIn";

import { useUserLocation } from "../../hooks/useLocation";
import { getNearbyStores } from "../../services/storeService";

/* =========================================================
   HOW IT WORKS
   ========================================================= */

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Tell us what you need",
    desc: "Type your shopping list naturally. No forms, filters, or endless catalog browsing.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI understands your list",
    desc: "Trustore turns your words into the products you actually need.",
  },
  {
    number: "03",
    icon: Store,
    title: "We find the best local match",
    desc: "Nearby verified stores are intelligently combined to cover your list.",
  },
  {
    number: "04",
    icon: ShoppingBag,
    title: "One simple checkout",
    desc: "Get everything you need through one seamless shopping experience.",
  },
];

/* =========================================================
   CATEGORIES
   ========================================================= */

const categories = [
  "Grocery",
  "Dairy",
  "Fruits & Veg",
  "Bakery",
  "Beverages",
  "Household",
  "Snacks",
  "Personal Care",
];

/* =========================================================
   SAMPLE AI ITEMS
   ========================================================= */

const sampleItems = [
  "Basmati rice",
  "Toor dal",
  "Milk",
  "Bread",
  "Bananas",
  "Apples",
];

/* =========================================================
   HOME
   ========================================================= */

export default function Home() {
  const {
    coords,
    permission,
    requesting,
    requestLocation,
  } = useUserLocation();

  const [stores, setStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);

  /* =======================================================
     GET NEARBY STORES
     ======================================================= */

  useEffect(() => {
    if (!coords) return;

    setLoadingStores(true);

    getNearbyStores(coords.lat, coords.lng)
      .then((res) => {
        setStores(res.data?.stores || res.data || []);
      })
      .catch(() => {
        setStores([]);
      })
      .finally(() => {
        setLoadingStores(false);
      });
  }, [coords]);

  return (
    <div className="overflow-hidden bg-base text-text-primary">
      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative -mt-16 min-h-[620px] h-[100svh] max-h-[900px] overflow-hidden bg-base">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-accent/10 blur-3xl" />

          <div className="absolute top-1/3 -right-40 w-[480px] h-[480px] rounded-full bg-emerald-400/5 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,rgba(0,200,150,0.10),transparent_32%),radial-gradient(circle_at_82%_70%,rgba(0,150,255,0.05),transparent_38%)]" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-full flex items-center">
            <div className="w-full grid lg:grid-cols-[1fr_0.9fr] gap-8 xl:gap-14 items-center">

              {/* =========================================
                  HERO LEFT
              ========================================= */}

              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.07,
                    },
                  },
                }}
                className="max-w-2xl"
              >
                {/* Badge */}

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 12,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-accent-soft border border-accent/20 mb-5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent" />

                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                    AI-Powered Hyperlocal Shopping
                  </span>
                </motion.div>

                {/* Heading */}

                <motion.h1
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="text-[2.8rem] sm:text-5xl lg:text-[4rem] xl:text-[4.4rem] font-heading font-extrabold leading-[0.98] tracking-[-0.035em] text-text-primary"
                >
                  Your next shopping trip

                  <span className="block mt-1">
                    starts with a{" "}
                    <span className="text-accent">
                      sentence.
                    </span>
                  </span>
                </motion.h1>

                {/* Description */}

                <motion.p
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="text-[var(--text-secondary)] text-sm sm:text-base lg:text-lg leading-relaxed mt-5 max-w-xl"
                >
                  Tell Trustore what you need in plain language.
                  Our AI understands your intent, finds the right
                  products nearby, and connects you with trusted
                  local stores.
                </motion.p>

                {/* Buttons */}

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="flex flex-col sm:flex-row gap-3 mt-6"
                >
                  <Link to="/shop-ai">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto px-6"
                    >
                      <Sparkles className="w-4 h-4" />

                      Start shopping with AI

                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link to="/stores">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Explore stores
                    </Button>
                  </Link>
                </motion.div>

                {/* Feature points */}

                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 18,
                    },
                    show: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  className="flex flex-wrap gap-x-6 gap-y-3 mt-7 pt-5 border-t border-border max-w-xl"
                >
                  {/* Feature 1 */}

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                    </div>

                    <span className="text-xs text-[var(--text-secondary)]">
                      AI understands your list
                    </span>
                  </div>

                  {/* Feature 2 */}

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                      <MapPinned className="w-3.5 h-3.5 text-accent" />
                    </div>

                    <span className="text-xs text-[var(--text-secondary)]">
                      Finds nearby stores
                    </span>
                  </div>

                  {/* Feature 3 */}

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    </div>

                    <span className="text-xs text-[var(--text-secondary)]">
                      Verified local sellers
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* =========================================
                  AI PREVIEW
              ========================================= */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                  ease: "easeOut",
                }}
                className="relative hidden lg:block"
              >
                <div className="absolute -inset-8 bg-accent/5 blur-3xl rounded-full" />

                <div className="relative bg-elevated border border-border rounded-[24px] p-3 shadow-2xl">

                  {/* Preview header */}

                  <div className="flex items-center justify-between px-2 pb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent-red/60" />
                      <span className="w-2 h-2 rounded-full bg-accent-yellow/60" />
                      <span className="w-2 h-2 rounded-full bg-accent/60" />
                    </div>

                    <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                      Trustore AI
                    </span>

                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </div>

                  {/* Chat area */}

                  <div className="bg-base border border-border rounded-xl p-4">

                    {/* User message */}

                    <div className="flex justify-end mb-4">
                      <div className="max-w-[82%] bg-accent text-white rounded-xl rounded-br-sm px-3.5 py-2.5">
                        <p className="text-[11px] font-medium leading-relaxed text-white">
                          I need rice, dal, milk, bread and some fruits for the week.
                        </p>
                      </div>
                    </div>

                    {/* AI response */}

                    <div className="flex gap-2.5">

                      <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                      </div>

                      <div className="flex-1 min-w-0">

                        <p className="text-[12px] font-semibold text-text-primary">
                          Trustore found a great match
                        </p>

                        <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 mb-3">
                          6 items matched across nearby verified stores.
                        </p>

                        {/* Match card */}

                        <div className="bg-card border border-accent/30 rounded-xl p-3.5">

                          <div className="flex items-center justify-between mb-3">

                            <div className="flex items-center gap-2">

                              <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                                <Store className="w-3 h-3 text-accent" />
                              </div>

                              <div>
                                <p className="text-[11px] font-bold text-text-primary">
                                  Best local match
                                </p>

                                <p className="text-[9px] text-[var(--text-secondary)]">
                                  3 verified stores • 420m away
                                </p>
                              </div>

                            </div>

                            <div className="text-right">

                              <p className="text-lg font-nums font-extrabold text-accent">
                                97%
                              </p>

                              <p className="text-[9px] text-[var(--text-secondary)]">
                                match
                              </p>

                            </div>
                          </div>

                          {/* Items */}

                          <div className="grid grid-cols-2 gap-1.5">

                            {sampleItems.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-surface"
                              >
                                <div className="w-3.5 h-3.5 rounded-full bg-accent/10 flex items-center justify-center">
                                  <Check className="w-2 h-2 text-accent" />
                                </div>

                                <span className="text-[9px] text-[var(--text-secondary)] truncate">
                                  {item}
                                </span>
                              </div>
                            ))}

                          </div>

                          {/* Coverage */}

                          <div className="mt-3">

                            <div className="flex justify-between mb-1">

                              <span className="text-[9px] text-[var(--text-secondary)]">
                                Shopping coverage
                              </span>

                              <span className="text-[9px] font-semibold text-accent">
                                6 / 6 found
                              </span>

                            </div>

                            <div className="h-1 rounded-full bg-input overflow-hidden">
                              <motion.div
                                initial={{
                                  width: 0,
                                }}
                                animate={{
                                  width: "100%",
                                }}
                                transition={{
                                  duration: 1,
                                  delay: 0.7,
                                }}
                                className="h-full rounded-full bg-accent"
                              />
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating verified card */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: 12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8,
                    }}
                    className="absolute -right-5 top-16 bg-card border border-border rounded-xl shadow-xl px-3 py-2.5 flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                      <BadgeCheck className="w-3.5 h-3.5 text-accent" />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-text-primary">
                        Verified stores
                      </p>

                      <p className="text-[9px] text-[var(--text-secondary)]">
                        Trusted local sellers
                      </p>
                    </div>
                  </motion.div>

                  {/* Floating location card */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 1,
                    }}
                    className="absolute -left-5 bottom-10 bg-card border border-border rounded-xl shadow-xl px-3 py-2.5 flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-lg bg-accent-soft flex items-center justify-center">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                    </div>

                    <div>
                      <p className="text-[11px] font-bold text-text-primary">
                        Near you
                      </p>

                      <p className="text-[9px] text-[var(--text-secondary)]">
                        Smart local matching
                      </p>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          VALUE STRIP
      =================================================== */}

      <section className="relative border-y border-border bg-card">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">

            {/* Value 1 */}

            <div className="flex items-center gap-4 py-4 sm:py-2 sm:px-7 sm:first:pl-0">

              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-accent" />
              </div>

              <div>
                <p className="text-sm font-bold text-text-primary">
                  Search less.
                </p>

                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Tell AI what you need.
                </p>
              </div>

            </div>

            {/* Value 2 */}

            <div className="flex items-center gap-4 py-4 sm:py-2 sm:px-7">

              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                <MapPinned className="w-4 h-4 text-accent" />
              </div>

              <div>
                <p className="text-sm font-bold text-text-primary">
                  Shop local.
                </p>

                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Discover stores around you.
                </p>
              </div>

            </div>

            {/* Value 3 */}

            <div className="flex items-center gap-4 py-4 sm:py-2 sm:px-7 sm:pr-0">

              <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>

              <div>
                <p className="text-sm font-bold text-text-primary">
                  Buy with confidence.
                </p>

                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Every store is verified.
                </p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          LOCATION
      =================================================== */}

      {permission !== "granted" && (
        <FadeIn>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

            <div className="bg-card border border-border rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                  <MapPinned className="w-5 h-5 text-accent" />
                </div>

                <div>

                  <p className="text-sm font-semibold text-text-primary">
                    Find what's available around you
                  </p>

                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Share your location to discover verified stores nearby.
                  </p>

                </div>
              </div>

              <div className="flex gap-2 w-full md:w-auto">

                <Button
                  size="sm"
                  loading={requesting}
                  onClick={requestLocation}
                  className="flex-1 md:flex-none"
                >
                  Allow location
                </Button>

                <Link
                  to="/addresses"
                  className="flex-1 md:flex-none"
                >
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full"
                  >
                    Enter manually
                  </Button>
                </Link>

              </div>
            </div>

          </section>

        </FadeIn>
      )}

      {/* ===================================================
          NEARBY STORES
      =================================================== */}

      {permission === "granted" && (
        <FadeIn>

          <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">

              <div>

                <div className="flex items-center gap-2 mb-1">

                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />

                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">
                    Around you
                  </span>

                </div>

                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                  {stores.length > 0
                    ? `${stores.length} stores ready to shop`
                    : "Verified stores near you"}
                </h2>

                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Discover trusted local stores in your area.
                </p>

              </div>

              <Link
                to="/stores"
                className="text-sm font-semibold text-accent inline-flex items-center gap-1.5 hover:opacity-80"
              >
                Explore all stores

                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

            </div>

            {/* Loading */}

            {loadingStores ? (

              <div className="bg-card border border-border rounded-2xl p-8 text-center">

                <p className="text-sm text-[var(--text-secondary)]">
                  Finding verified stores near you...
                </p>

              </div>

            ) : stores.length > 0 ? (

              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-3">

                {stores.map((store) => (
                  <StoreCard
                    key={store._id}
                    store={store}
                  />
                ))}

              </div>

            ) : (

              <div className="bg-card border border-border rounded-2xl p-8 text-center">

                <MapPin className="w-5 h-5 text-text-muted mx-auto mb-2" />

                <p className="text-sm font-medium text-text-primary">
                  No verified stores in your area yet
                </p>

                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  More local stores will appear as they join Trustore.
                </p>

              </div>
            )}

          </section>

        </FadeIn>
      )}

      {/* ===================================================
          HOW IT WORKS
      =================================================== */}

      <FadeIn>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">

          <div className="max-w-2xl mb-10">

            <div className="flex items-center gap-2 mb-2">

              <Sparkles className="w-4 h-4 text-accent" />

              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">
                The Trustore experience
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
              From a messy shopping list to a smarter local order.
            </h2>

            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              You don't need to know which store has what. Just tell Trustore what you need.
            </p>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {steps.map((step, index) => (
              <FadeIn
                key={step.number}
                delay={index * 0.08}
              >

                <div className="group bg-card border border-border rounded-2xl p-5 h-full hover:border-accent/40 hover:shadow-md transition-all">

                  <div className="flex items-center justify-between mb-7">

                    <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-accent" />
                    </div>

                    <span className="text-xs font-nums font-bold text-text-muted">
                      {step.number}
                    </span>

                  </div>

                  <h3 className="font-heading font-bold text-text-primary text-sm">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-2">
                    {step.desc}
                  </p>

                </div>

              </FadeIn>
            ))}

          </div>

        </section>

      </FadeIn>

      {/* ===================================================
          DIFFERENTIATOR
      =================================================== */}

      <FadeIn>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

          <div className="relative overflow-hidden bg-elevated border border-border rounded-[28px] p-7 sm:p-10 lg:p-12">

            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 items-center">

              {/* Left */}

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-soft border border-accent/20 mb-5">

                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />

                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">
                    Local, but smarter
                  </span>

                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-text-primary leading-tight">
                  Your neighborhood stores,
                  <span className="text-accent">
                    {" "}connected by AI.
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mt-4 max-w-xl">
                  Trustore brings local stores into one intelligent shopping experience.
                  Instead of checking every store yourself, let AI figure out where your
                  shopping list can be fulfilled.
                </p>

                <div className="flex flex-wrap gap-3 mt-7">

                  <Link to="/shop-ai">

                    <Button>
                      <Sparkles className="w-4 h-4" />
                      Try Trustore AI
                    </Button>

                  </Link>

                  <Link
                    to="/stores"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-accent px-2"
                  >
                    Meet local stores

                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                </div>

              </div>

              {/* Right cards */}

              <div className="grid sm:grid-cols-2 gap-3">

                {[
                  {
                    icon: Sparkles,
                    title: "Natural language",
                    desc: "Shop the way you talk.",
                  },
                  {
                    icon: MapPinned,
                    title: "Local discovery",
                    desc: "Find stores around you.",
                  },
                  {
                    icon: BadgeCheck,
                    title: "Verified sellers",
                    desc: "Shop from trusted stores.",
                  },
                  {
                    icon: ShoppingBag,
                    title: "One shopping flow",
                    desc: "Build your order faster.",
                  },
                ].map((item) => (

                  <div
                    key={item.title}
                    className="bg-card/70 border border-border rounded-xl p-4 hover:border-accent/30 hover:-translate-y-0.5 transition-all"
                  >

                    <item.icon className="w-4 h-4 text-accent mb-3" />

                    <p className="text-sm font-bold text-text-primary">
                      {item.title}
                    </p>

                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {item.desc}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

      </FadeIn>

      {/* ===================================================
          CATEGORIES
      =================================================== */}

      <FadeIn>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <ShoppingBag className="w-4 h-4 text-accent" />

                <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-accent">
                  Start exploring
                </span>

              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                Everything you shop for, locally.
              </h2>

            </div>

            <Link
              to="/stores"
              className="text-sm font-semibold text-accent inline-flex items-center gap-1.5 hover:opacity-80"
            >
              Browse stores

              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

          </div>

          <div className="flex flex-wrap gap-2.5">

            {categories.map((category) => (

              <Link
                key={category}
                to={`/stores?category=${encodeURIComponent(category)}`}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border text-sm font-medium text-[var(--text-secondary)] hover:border-accent hover:text-accent hover:bg-accent-soft transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >

                <span>
                  {category}
                </span>

                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />

              </Link>

            ))}

          </div>

        </section>

      </FadeIn>

      {/* ===================================================
          FINAL CTA
      =================================================== */}

      <section className="relative border-t border-border bg-card overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(0,200,150,0.10),transparent_55%)]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">

          <div className="w-12 h-12 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-5">

            <Sparkles className="w-5 h-5 text-accent" />

          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-text-primary leading-tight">

            Your next shopping trip

            <span className="block text-accent">
              starts with a sentence.
            </span>

          </h2>

          {/* IMPORTANT:
              This was the white-on-white problem.
              It now follows --text-secondary.
          */}

          <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xl mx-auto mt-4 leading-relaxed">
            Tell Trustore what you need. We'll help you discover the best local way to get it.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

            <Link to="/shop-ai">

              <Button
                size="lg"
                className="w-full sm:w-auto px-7"
              >
                <Sparkles className="w-4 h-4" />

                Start shopping with AI

                <ArrowRight className="w-4 h-4" />
              </Button>

            </Link>

            <Link to="/stores">

              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Explore stores
              </Button>

            </Link>

          </div>

        </div>

      </section>
    </div>
  );
}