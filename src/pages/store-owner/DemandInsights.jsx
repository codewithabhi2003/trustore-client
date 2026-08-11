import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  TrendingUp,
  PackageSearch,
  ArrowUpRight,
  Store,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
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

  const totalSearches = insights.reduce(
    (sum, item) => sum + (item.searchCount || 0),
    0
  );

  const totalLostSearches = insights.reduce(
    (sum, item) => sum + (item.fulfilledElsewhere || 0),
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/store-owner/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to dashboard
      </Link>

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Store intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Demand insights
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Understand what customers nearby are searching for and discover
            products you could add to your store.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className="w-2 h-2 rounded-full bg-accent" />
          Last 30 days
        </div>
      </div>

      {/* Overview card */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden mb-6">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-accent" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-text-primary">
                What customers are looking for
              </h2>

              <p className="text-xs text-text-muted mt-1 leading-relaxed max-w-2xl">
                These products were requested through AI shopping searches
                from customers near your store. Stocking high-demand items
                can help you capture more local purchases.
              </p>
            </div>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-surface border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Products in demand
                </span>

                <PackageSearch className="w-4 h-4 text-text-muted" />
              </div>

              <p className="text-xl font-nums font-bold text-text-primary mt-2">
                {insights.length}
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Nearby searches
                </span>

                <Search className="w-4 h-4 text-text-muted" />
              </div>

              <p className="text-xl font-nums font-bold text-text-primary mt-2">
                {totalSearches}
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">
                  Fulfilled elsewhere
                </span>

                <Store className="w-4 h-4 text-text-muted" />
              </div>

              <p className="text-xl font-nums font-bold text-text-primary mt-2">
                {totalLostSearches}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demand list */}
      {insights.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <div className="py-14 px-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mx-auto mb-4">
              <PackageSearch className="w-6 h-6 text-text-muted" />
            </div>

            <h2 className="text-sm font-semibold text-text-primary">
              No demand insights yet
            </h2>

            <p className="text-xs text-text-muted mt-1.5 max-w-md mx-auto leading-relaxed">
              There aren't enough nearby AI shopping searches yet to generate
              product recommendations for your store.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          {/* List header */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Products customers want
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Prioritize products with the highest search demand.
              </p>
            </div>

            <span className="text-xs text-text-muted">
              {insights.length} product
              {insights.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Column labels */}
          <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_140px_170px] gap-4 px-5 py-2.5 bg-surface border-b border-border text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            <span>Product</span>
            <span>Search demand</span>
            <span>Opportunity</span>
          </div>

          {/* Insight rows */}
          <div className="divide-y divide-border">
            {insights.map((item, index) => {
              const searchCount = item.searchCount || 0;
              const fulfilledElsewhere = item.fulfilledElsewhere || 0;

              return (
                <div
                  key={item.itemName}
                  className="px-5 py-4 sm:py-5 hover:bg-surface/60 transition-colors"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_140px_170px] gap-4 sm:items-center">

                    {/* Product */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center shrink-0">
                        <span className="text-xs font-nums font-bold text-text-muted">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary capitalize truncate">
                          {item.itemName}
                        </p>

                        <p className="text-xs text-text-muted mt-0.5">
                          Product not currently stocked
                        </p>
                      </div>
                    </div>

                    {/* Search demand */}
                    <div>
                      <p className="text-xs text-text-muted sm:hidden mb-1">
                        Search demand
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-nums font-semibold text-text-primary">
                          {searchCount}
                        </span>

                        <span className="text-xs text-text-muted">
                          search{searchCount !== 1 ? 'es' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Opportunity */}
                    <div>
                      <p className="text-xs text-text-muted sm:hidden mb-1">
                        Opportunity
                      </p>

                      {fulfilledElsewhere > 0 ? (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-accent-red">
                              {fulfilledElsewhere} lost
                            </p>

                            <p className="text-[11px] text-text-muted mt-0.5">
                              Went to another store
                            </p>
                          </div>

                          <Link
                            to="/store-owner/products"
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                            aria-label={`List ${item.itemName}`}
                            title={`List ${item.itemName}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-accent">
                              New opportunity
                            </p>

                            <p className="text-[11px] text-text-muted mt-0.5">
                              Demand detected nearby
                            </p>
                          </div>

                          <Link
                            to="/store-owner/products"
                            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/30 transition-colors"
                            aria-label={`List ${item.itemName}`}
                            title={`List ${item.itemName}`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}