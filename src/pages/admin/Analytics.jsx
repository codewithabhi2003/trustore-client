import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BarChart3,
  Store,
  TrendingUp,
  Trophy,
  IndianRupee,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setData({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const topStores = data?.topStores || [];

  const analytics = useMemo(() => {
    const totalRevenue = topStores.reduce(
      (sum, store) => sum + (store.revenue || 0),
      0
    );

    const topStore = topStores.reduce(
      (highest, store) =>
        !highest || (store.revenue || 0) > (highest.revenue || 0)
          ? store
          : highest,
      null
    );

    return {
      totalRevenue,
      topStore,
      storeCount: topStores.length,
    };
  }, [topStores]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Crunching platform numbers..."
      />
    );
  }

  const summaryCards = [
    {
      icon: Store,
      label: 'Stores ranked',
      value: analytics.storeCount,
      description: 'Stores with available revenue data',
    },
    {
      icon: IndianRupee,
      label: 'Revenue shown',
      value: formatPrice(analytics.totalRevenue),
      description: 'Revenue represented in this chart',
    },
    {
      icon: Trophy,
      label: 'Top store',
      value: analytics.topStore?.storeName || '—',
      description: 'Highest revenue in the ranking',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Back navigation */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to admin dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Platform intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Platform analytics
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Understand store performance and identify the
            highest-revenue stores across Trustore.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Revenue performance
        </div>
      </div>

      {/* Summary cards */}
      {topStores.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-7">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-accent" />
                </div>

                <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary truncate">
                  {card.value}
                </p>

                <p className="text-xs font-medium text-text-primary mt-1">
                  {card.label}
                </p>

                <p className="text-[11px] text-text-muted mt-0.5">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        {/* Chart header */}
        <div className="px-5 sm:px-6 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Top stores by revenue
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Revenue comparison across the stores returned by the
                analytics API.
              </p>
            </div>

            {topStores.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Revenue
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 sm:p-6">
          {topStores.length ? (
            <ResponsiveContainer
              width="100%"
              height={380}
            >
              <BarChart
                data={topStores}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 50,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="storeName"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickFormatter={(value) =>
                    formatPrice(value)
                  }
                  tickLine={false}
                  axisLine={false}
                  width={70}
                />

                <Tooltip
                  formatter={(value) => [
                    formatPrice(value),
                    'Revenue',
                  ]}
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    boxShadow:
                      '0 4px 12px rgba(0, 0, 0, 0.08)',
                    fontSize: 12,
                  }}
                  labelStyle={{
                    color: 'var(--text-muted)',
                    marginBottom: 4,
                  }}
                  cursor={{
                    fill: 'var(--surface)',
                  }}
                />

                <Bar
                  dataKey="revenue"
                  fill="var(--accent)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[380px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-text-muted" />
              </div>

              <h3 className="text-sm font-semibold text-text-primary">
                No analytics data yet
              </h3>

              <p className="text-xs text-text-muted mt-1 max-w-sm">
                There isn't enough platform revenue data available
                to generate the store performance chart.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Top store highlight */}
      {analytics.topStore && (
        <div className="mt-4 bg-surface border border-border rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 text-accent" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
                Leading store
              </p>

              <p className="text-sm font-semibold text-text-primary mt-0.5">
                {analytics.topStore.storeName}
              </p>

              <p className="text-xs text-text-muted mt-0.5">
                Generated{' '}
                <span className="font-nums font-medium text-text-secondary">
                  {formatPrice(
                    analytics.topStore.revenue || 0
                  )}
                </span>{' '}
                in the revenue data returned by the API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer note */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">
            Analytics note:
          </span>{' '}
          This page uses the store revenue data returned by
          <span className="font-nums"> /admin/analytics</span>.
        </p>
      </div>
    </div>
  );
}