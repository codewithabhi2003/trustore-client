import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Star,
  MapPin,
  Mail,
  Phone,
  User,
  Lock,
  Store,
  ShoppingBag,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

import VerifiedBadge from '../../components/store/VerifiedBadge';
import ProductCard from '../../components/product/ProductCard';
import ReviewCard from '../../components/review/ReviewCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

import {
  getStoreById,
  getStoreProducts,
} from '../../services/storeService';

import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function StoreDetail() {
  const { id } = useParams();

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);

    Promise.all([
      getStoreById(id),
      getStoreProducts(id),
      api.get(`/reviews/store/${id}`),
    ])
      .then(([storeRes, productsRes, reviewsRes]) => {
        setStore(storeRes.data.store || storeRes.data);
        setProducts(
          productsRes.data.products ||
            productsRes.data ||
            []
        );
        setReviews(
          reviewsRes.data.reviews ||
            reviewsRes.data ||
            []
        );
      })
      .catch(() => {
        toast.error(
          'Could not load this store right now'
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const categories = useMemo(
    () => [
      'All',
      ...new Set(
        products
          .map((p) => p.categoryId?.name)
          .filter(Boolean)
      ),
    ],
    [products]
  );

  const visibleProducts = useMemo(() => {
    if (activeCategory === 'All') {
      return products;
    }

    return products.filter(
      (p) =>
        p.categoryId?.name === activeCategory
    );
  }, [products, activeCategory]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading store..."
      />
    );
  }

  if (!store) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState
          icon={Store}
          title="Store not found"
          description="This store may no longer be available."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Store header */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden mb-6">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
                <Store className="w-7 h-7 text-accent" />
              </div>

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
                    {store.storeName}
                  </h1>

                  <VerifiedBadge size="md" />
                </div>

                <p className="text-sm text-text-secondary mt-1">
                  {store.category}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-text-muted">

                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {store.address?.fullAddress ||
                      store.address?.city ||
                      'Location unavailable'}
                  </span>

                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 w-fit">

              <div className="w-9 h-9 rounded-lg bg-accent-yellow/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
              </div>

              <div>
                <div className="flex items-center gap-1">
                  <span className="font-nums font-bold text-text-primary">
                    {store.rating?.toFixed(1) ??
                      'New'}
                  </span>

                  {store.totalRatings > 0 && (
                    <span className="text-xs text-text-muted">
                      / 5
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-text-muted">
                  {store.totalRatings ?? 0}{' '}
                  {store.totalRatings === 1
                    ? 'review'
                    : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Store stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-border">

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 text-accent" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {products.length}
                </p>

                <p className="text-[11px] text-text-muted">
                  Products
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-accent" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {store.rating?.toFixed(1) ??
                    'New'}
                </p>

                <p className="text-[11px] text-text-muted">
                  Store rating
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-accent" />
              </div>

              <div>
                <p className="text-sm font-semibold text-text-primary">
                  Local
                </p>

                <p className="text-[11px] text-text-muted">
                  Nearby store
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Contact */}
      <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden mb-8">

        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-accent" />

            <h2 className="text-sm font-semibold text-text-primary">
              Store contact
            </h2>
          </div>

          <p className="text-[11px] text-text-muted mt-0.5">
            Contact information for this store.
          </p>
        </div>

        <div className="p-5">

          {user ? (
            <div className="grid sm:grid-cols-3 gap-3">

              <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Owner
                  </p>

                  <p className="text-sm font-medium text-text-primary truncate">
                    {store.ownerName ||
                      'Store owner'}
                  </p>
                </div>
              </div>

              <a
                href={`mailto:${store.email}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Email
                  </p>

                  <p className="text-sm font-medium text-text-primary truncate">
                    {store.email || 'Not available'}
                  </p>
                </div>
              </a>

              <a
                href={`tel:${store.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border hover:border-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wide text-text-muted">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-text-primary truncate">
                    {store.phone || 'Not available'}
                  </p>
                </div>
              </a>

            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">

              <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-accent" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Contact details are private
                </p>

                <p className="text-xs text-text-muted mt-0.5">
                  Sign in to see the store owner's contact details.
                </p>
              </div>

              <Link
                to="/login"
                className="text-xs font-semibold text-accent inline-flex items-center gap-1 shrink-0"
              >
                Sign in
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="mb-10">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">

          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-accent" />

              <h2 className="text-lg font-heading font-bold text-text-primary">
                Products
              </h2>

              <span className="text-xs font-medium text-text-muted bg-surface border border-border px-2 py-0.5 rounded-full">
                {visibleProducts.length}
              </span>
            </div>

            <p className="text-xs text-text-muted mt-1">
              Browse products available from this store.
            </p>
          </div>

        </div>

        {/* Categories */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-5">

            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-input text-text-secondary hover:bg-elevated hover:text-text-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {visibleProducts.length === 0 ? (
          <div className="bg-card border border-border rounded-card shadow-sm p-8">
            <EmptyState
              icon={ShoppingBag}
              title="No products available"
              description={
                activeCategory === 'All'
                  ? "This store hasn't listed any products yet."
                  : `No products found in ${activeCategory}.`
              }
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                storeId={store._id}
                storeName={store.storeName}
                onAdd={(item) => {
                  addItem(
                    item,
                    store._id,
                    store.storeName
                  );

                  toast.success(
                    `${item.name} added to cart`
                  );
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* Reviews */}
      <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-border">

          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />

                <h2 className="text-sm font-semibold text-text-primary">
                  Customer reviews
                </h2>

                {reviews.length > 0 && (
                  <span className="text-xs text-text-muted">
                    ({reviews.length})
                  </span>
                )}
              </div>

              <p className="text-[11px] text-text-muted mt-0.5">
                See what customers say about this store.
              </p>
            </div>

            {store.rating && (
              <div className="hidden sm:flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-accent-yellow fill-accent-yellow" />

                <span className="text-sm font-bold font-nums text-text-primary">
                  {store.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">

          {reviews.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                <Star className="w-4 h-4 text-text-muted" />
              </div>

              <p className="text-sm font-medium text-text-primary">
                No reviews yet
              </p>

              <p className="text-xs text-text-muted mt-1">
                Be the first to order and review this store.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}