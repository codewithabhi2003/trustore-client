import { useRef, useState } from 'react';
import { Sparkles, MapPin, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import ExtractedProductsList from './ExtractedProductsList';
import AITypingIndicator from './AITypingIndicator';
import ClusterCard from '../cluster/ClusterCard';
import EmptyState from '../common/EmptyState';
import FadeIn from '../common/FadeIn';
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

const MIN_DISPLAY_MS = 1500;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function AIShoppingAssistant() {
  const [text, setText] = useState('');
  const [step, setStep] = useState(STEP.IDLE);
  const [products, setProducts] = useState([]);
  const [result, setResult] = useState(null);

  const lastSubmitRef = useRef(0);

  const { coords, permission, requesting, requestLocation } = useUserLocation();
  const { addItem } = useCart();

  const isProcessing =
    step === STEP.EXTRACTING ||
    step === STEP.CLUSTERING ||
    requesting;

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error('Tell us what you need first');
      return;
    }

    const now = Date.now();

    if (now - lastSubmitRef.current < 1000) {
      return;
    }

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
    setProducts([]);
    setStep(STEP.EXTRACTING);

    const started = Date.now();

    try {
      /* Step 1 — Extract products */
      const { data } = await extractProducts(text);

      const elapsed = Date.now() - started;

      if (elapsed < MIN_DISPLAY_MS) {
        await wait(MIN_DISPLAY_MS - elapsed);
      }

      const extractedProducts = data.products || [];

      if (!extractedProducts.length) {
        toast.error('I could not identify any products from your request.');
        setStep(STEP.IDLE);
        return;
      }

      setProducts(extractedProducts);
      setStep(STEP.EXTRACTED);

      await wait(600);

      /* Step 2 — Find best store clusters */
      setStep(STEP.CLUSTERING);

      const clusterStarted = Date.now();

      const { data: clusterData } = await findBestCluster(
        location.lat,
        location.lng,
        extractedProducts
      );

      const clusterElapsed = Date.now() - clusterStarted;

      if (clusterElapsed < 900) {
        await wait(900 - clusterElapsed);
      }

      setResult(clusterData);
      setStep(STEP.RESULTS);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'AI shopping failed. Please try again.'
      );

      setStep(STEP.IDLE);
    }
  };

  const handleAddCluster = (cluster, chosenProducts) => {
    let added = 0;

    (chosenProducts || []).forEach(({ match, product }) => {
      if (!product) return;

      addItem(
        product,
        product.storeId?._id || product.storeId,
        product.storeId?.storeName ||
          cluster.stores?.[0]?.storeName ||
          'Local store',
        match?.requestedQuantity || 1
      );

      added += 1;
    });

    if (added > 0) {
      toast.success(
        `Added ${added} item${added !== 1 ? 's' : ''} to your cart`
      );
    }
  };

  const handleAddSubstitute = (product) => {
    if (!product) return;

    addItem(
      product,
      product.storeId?._id || product.storeId,
      product.storeId?.storeName || 'Local store',
      1
    );

    toast.success(`${product.name} added to cart`);
  };

  /*
   * Keep exactly TWO cluster cards:
   * 1. Best recommended cluster
   * 2. Best alternative cluster
   */
  const clusters = result?.allClusters || [];

  const bestCluster =
    result?.bestCluster || clusters[0] || null;

  const alternativeCluster =
    clusters.find(
      (cluster) =>
        cluster.clusterId !== bestCluster?.clusterId
    ) || null;

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">

      {/* LEFT — AI INPUT */}
      <div className="bg-card border border-border rounded-card shadow-sm p-6 lg:sticky lg:top-24">

        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
        </div>

        <h2 className="text-xl font-heading font-bold text-text-primary">
          AI shopping assistant
        </h2>

        <p className="text-sm text-text-secondary mt-1.5 mb-4">
          Tell Trustore what you need in your own words. We'll understand
          your list, find trusted nearby stores, and recommend the best
          shopping option.
        </p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I need 2kg rice, 1L milk, bread, tea, cooking oil..."
          rows={5}
          disabled={isProcessing}
          className="w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent outline-none resize-none disabled:opacity-60"
        />

        {permission !== 'granted' && (
          <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            We'll ask for your location to find trusted stores nearby.
          </p>
        )}

        <Button
          onClick={handleSubmit}
          loading={isProcessing}
          disabled={isProcessing}
          className="w-full mt-4"
        >
          <Search className="w-4 h-4" />
          Find my best options
        </Button>
      </div>

      {/* RIGHT — RESULTS */}
      <div className="min-h-[320px]">

        {/* IDLE */}
        {step === STEP.IDLE && (
          <EmptyState
            icon={Sparkles}
            title="Your smart shopping results appear here"
            description="Tell Trustore what you're looking for and we'll extract your list, compare nearby stores, and find the best combination for you."
          />
        )}

        {/* EXTRACTING */}
        {step === STEP.EXTRACTING && (
          <div className="bg-card border border-border rounded-card shadow-sm p-6">

            <AITypingIndicator
              label="Understanding your shopping list..."
            />

            <p className="text-xs text-text-muted mt-4">
              Identifying products, quantities, and units.
            </p>
          </div>
        )}

        {/* EXTRACTED / CLUSTERING */}
        {(step === STEP.EXTRACTED || step === STEP.CLUSTERING) && (
          <div className="bg-card border border-border rounded-card shadow-sm p-6 space-y-5">

            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                Your shopping list
              </p>

              <ExtractedProductsList products={products} />
            </div>

            {step === STEP.CLUSTERING && (
              <div className="border-t border-border pt-4">
                <AITypingIndicator
                  label="Finding the best trusted stores near you..."
                />
              </div>
            )}
          </div>
        )}

        {/* RESULTS */}
        {step === STEP.RESULTS && result && (
          <div className="space-y-5">

            <div className="bg-card border border-border rounded-card shadow-sm p-5">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">
                Products understood
              </p>

              <ExtractedProductsList products={products} />
            </div>

            {result.success === false ? (
              <div className="bg-card border border-border rounded-card shadow-sm">
                <EmptyState
                  icon={MapPin}
                  title="No verified stores nearby"
                  description={
                    result.message ||
                    'Try a wider search radius or check back soon as more trusted stores join Trustore.'
                  }
                />
              </div>
            ) : (
              <>
                {/* BEST MATCH */}
                {bestCluster && (
                  <FadeIn>
                    <ClusterCard
                      cluster={bestCluster}
                      isBest
                      onAddToCart={handleAddCluster}
                      onAddSubstitute={handleAddSubstitute}
                    />
                  </FadeIn>
                )}

                {/* BEST ALTERNATIVE */}
                {alternativeCluster && (
                  <FadeIn delay={0.1}>
                    <ClusterCard
                      cluster={alternativeCluster}
                      onAddToCart={handleAddCluster}
                      onAddSubstitute={handleAddSubstitute}
                    />
                  </FadeIn>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}