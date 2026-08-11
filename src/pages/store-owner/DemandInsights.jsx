import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PackageSearch, ArrowLeft, Store } from 'lucide-react';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { getDemandInsights } from '../../services/storeService';

export default function DemandInsights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDemandInsights()
      .then((res) => {
        setInsights(res.data.insights || []);
      })
      .catch(() => {
        setInsights([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader fullScreen label="Loading demand insights..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Link to="/store-owner/dashboard">
          <button
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>

        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Local demand insights
          </h1>

          <p className="text-sm text-text-muted mt-1">
            Discover products customers nearby are searching for that your
            store doesn't currently stock.
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-card border border-border rounded-card shadow-sm p-5 mt-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              AI shopping demand
            </h2>

            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              These insights are generated from AI shopping searches made by
              customers near your store during the last 30 days. Use them to
              identify products that could help you capture additional local
              demand.
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
            <PackageSearch className="w-6 h-6 text-text-muted" />
          </div>

          <h2 className="text-sm font-semibold text-text-primary">
            No demand insights yet
          </h2>

          <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
            There aren't enough nearby AI shopping searches yet to generate
            product recommendations for your store.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          {/* Section heading */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Products customers are looking for
                </h2>

                <p className="text-xs text-text-muted mt-0.5">
                  Based on nearby AI shopping searches in the last 30 days.
                </p>
              </div>

              <span className="text-xs font-medium text-text-muted">
                {insights.length} insight{insights.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* List */}
          <div className="divide-y divide-border">
            {insights.map((item) => (
              <div
                key={item.itemName}
                className="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center shrink-0">
                    <PackageSearch className="w-4 h-4 text-accent" />
                  </div>

                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-text-primary capitalize">
                      {item.itemName}
                    </span>

                    <p className="text-xs text-text-muted mt-0.5">
                      Searched {item.searchCount} time
                      {item.searchCount !== 1 ? 's' : ''} nearby
                    </p>

                    {item.fulfilledElsewhere > 0 && (
                      <p className="text-xs text-accent-red mt-0.5">
                        {item.fulfilledElsewhere} search
                        {item.fulfilledElsewhere !== 1 ? 'es' : ''} were
                        fulfilled by another store
                      </p>
                    )}
                  </div>
                </div>

                <Link
                  to="/store-owner/products"
                  className="shrink-0"
                >
                  <Button size="sm" variant="ghost">
                    List it →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    
    </div>
  );
}