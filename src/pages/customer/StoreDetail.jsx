import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Star, MapPin } from 'lucide-react';
import VerifiedBadge from '../../components/store/VerifiedBadge';
import ProductCard from '../../components/product/ProductCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getStoreById, getStoreProducts } from '../../services/storeService';
import { useCart } from '../../hooks/useCart';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([getStoreById(id), getStoreProducts(id)])
      .then(([storeRes, productsRes]) => {
        setStore(storeRes.data.store || storeRes.data);
        setProducts(productsRes.data.products || productsRes.data || []);
      })
      .catch(() => toast.error('Could not load this store right now'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader fullScreen label="Loading store..." />;
  if (!store) return <EmptyState icon={MapPin} title="Store not found" />;

  const categories = ['All', ...new Set(products.map((p) => p.categoryId?.name).filter(Boolean))];
  const visible = activeCategory === 'All' ? products : products.filter((p) => p.categoryId?.name === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-heading font-bold text-text-primary">{store.storeName}</h1>
            <VerifiedBadge size="md" />
          </div>
          <p className="text-sm text-text-secondary">
            {store.category} &nbsp;•&nbsp; {store.address?.fullAddress || store.address?.city}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-2">
          <Star className="w-4 h-4 text-accent-yellow fill-accent-yellow" />
          <span className="font-nums font-bold text-sm">{store.rating?.toFixed(1) ?? 'New'}</span>
          <span className="text-xs text-text-muted">({store.totalRatings ?? 0})</span>
        </div>
      </div>

      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === c ? 'bg-accent text-white' : 'bg-input text-text-secondary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState title="No products yet" description="This store hasn't listed products in this category." />
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visible.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              storeId={store._id}
              storeName={store.storeName}
              onAdd={(product) => {
                addItem(product, store._id, store.storeName);
                toast.success(`${product.name} added to cart`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}