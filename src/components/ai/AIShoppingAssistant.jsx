import { useRef, useState } from 'react';
import { Sparkles, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import ExtractedProductsList from './ExtractedProductsList';
import AITypingIndicator from './AITypingIndicator';
import ClusterCard from '../cluster/ClusterCard';
import EmptyState from '../common/EmptyState';
import { extractProducts } from '../../services/aiService';
import { findBestCluster } from '../../services/clusterService';
import { useUserLocation } from '../../hooks/useLocation';
import { useCart } from '../../hooks/useCart';

const STEP = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  EXTRACTED: 'extracted',
  CLUSTERING: 'clustering',
  RESULTS: 'results',
};

const MIN_DISPLAY_MS = 1500; // keep the "AI is thinking" state visible for at least this long
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AIShoppingAssistant() {
  const [text, setText] = useState('');
  const [step, setStep] = useState(STEP.IDLE);
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);
  const lastSubmitRef = useRef(0);
  const { coords, permission, requesting, requestLocation } = useUserLocation();
  const { addItem } = useCart();

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Tell us what you need first');
      return;
    }
    // 1s debounce to stay under Groq's free-tier rate limit
    const now = Date.now();
    if (now - lastSubmitRef.current < 1000) return;
    lastSubmitRef.current = now;

    let location = coords;
    if (!location) {
      try {
        location = await requestLocation();
      } catch {
        toast.error('We need your location to find nearby stores');
        return;
      }
    }

    setResult(null);
    setStep(STEP.EXTRACTING);
    const started = Date.now();

    try {
      const { data } = await extractProducts(text);
      const elapsed = Date.now() - started;
      if (elapsed < MIN_DISPLAY_MS) await wait(MIN_DISPLAY_MS - elapsed);

      setProducts(data.products || []);
      setStep(STEP.EXTRACTED);
      await wait(600);

      setStep(STEP.CLUSTERING);
      const clusterStarted = Date.now();
      const { data: clusterData } = await findBestCluster(location.lat, location.lng, data.products);
      const clusterElapsed = Date.now() - clusterStarted;
      if (clusterElapsed < 900) await wait(900 - clusterElapsed);

      setResult(clusterData);
      setStep(STEP.RESULTS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI extraction failed. Please try again.');
      setStep(STEP.IDLE);
    }
  };

  const handleAddCluster = (cluster) => {
    let added = 0;
    cluster.productMatches
      ?.filter((p) => p.available)
      .forEach((p) => {
        const product = p.products[0];
        addItem(product, product.storeId?._id || product.storeId, product.storeId?.storeName || cluster.stores[0]?.storeName, p.requestedQuantity || 1);
        added += 1;
      });
    toast.success(`Added ${added} item${added !== 1 ? 's' : ''} to your cart`);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* Left — input panel */}
      <div className="bg-card border border-border rounded-card shadow-sm p-6 lg:sticky lg:top-24">
        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-heading font-bold text-text-primary">AI shopping assistant</h2>
        <p className="text-sm text-text-secondary mt-1.5 mb-4">
          Tell it what you need, in your own words — it finds the best local stores for you.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I need 2kg rice, 1L milk, bread, tea, cooking oil..."
          rows={5}
          className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none resize-none"
        />

        {permission !== 'granted' && (
          <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            We'll ask for your location to match nearby stores.
          </p>
        )}

        <Button
          onClick={handleSubmit}
          loading={step === STEP.EXTRACTING || step === STEP.CLUSTERING || requesting}
          className="w-full mt-4"
        >
          <Search className="w-4 h-4" />
          Find best stores
        </Button>
      </div>

      {/* Right — results panel */}
      <div className="min-h-[320px]">
        {step === STEP.IDLE && (
          <EmptyState
            icon={Sparkles}
            title="Your matches will show up here"
            description="Paste a grocery list on the left and we'll do the rest — extraction, matching, and scoring."
          />
        )}

        {step === STEP.EXTRACTING && (
          <div className="bg-card border border-border rounded-card p-6">
            <AITypingIndicator label="Understanding your list..." />
          </div>
        )}

        {(step === STEP.EXTRACTED || step === STEP.CLUSTERING) && (
          <div className="bg-card border border-border rounded-card p-6 space-y-4">
            <ExtractedProductsList products={products} />
            <AITypingIndicator label="Finding best store clusters near you..." />
          </div>
        )}

        {step === STEP.RESULTS && result && (
          <div className="space-y-5">
            <ExtractedProductsList products={products} />
            {result.success === false ? (
              <EmptyState
                icon={MapPin}
                title="No verified stores nearby"
                description={result.message || 'Try a wider search radius or check back soon as more stores join.'}
              />
            ) : (
              <>
                <ClusterCard cluster={result.bestCluster} isBest onAddToCart={handleAddCluster} />
                {result.allClusters?.slice(1, 3).map((c) => (
                  <ClusterCard key={c.clusterId} cluster={c} onAddToCart={handleAddCluster} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
