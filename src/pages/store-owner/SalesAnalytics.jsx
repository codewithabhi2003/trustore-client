import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  Wallet,
  Receipt,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function SalesAnalytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/store-orders')
      .then((res) => {
        setOrders(res.data.orders || res.data || []);
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const analytics = useMemo(() => {
    const byDay = {};

    orders.forEach((order) => {
      if (!order.createdAt) return;

      const date = new Date(order.createdAt);

      const day = date.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      });

      byDay[day] = (byDay[day] || 0) + (order.totalAmount || 0);
    });

    const chartData = Object.entries(byDay).map(
      ([day, revenue]) => ({
        day,
        revenue,
      })
    );

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    const totalOrders = orders.length;

    const averageOrderValue =
      totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      chartData,
      totalRevenue,
      totalOrders,
      averageOrderValue,
    };
  }, [orders]);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Crunching your sales..."
      />
    );
  }

  const stats = [
    {
      icon: Wallet,
      label: 'Total revenue',
      value: formatPrice(analytics.totalRevenue),
      description: 'Revenue from all orders',
    },
    {
      icon: ShoppingBag,
      label: 'Total orders',
      value: analytics.totalOrders,
      description: 'Orders received',
    },
    {
      icon: Receipt,
      label: 'Average order value',
      value: formatPrice(analytics.averageOrderValue),
      description: 'Average revenue per order',
    },
  ];

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
              Store performance
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Sales analytics
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Track your store revenue and understand how your sales
            are performing over time.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent" />
          All available orders
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
              </div>

              <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary truncate">
                {stat.value}
              </p>

              <p className="text-xs font-medium text-text-primary mt-1">
                {stat.label}
              </p>

              <p className="text-[11px] text-text-muted mt-0.5">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue chart */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        {/* Chart header */}
        <div className="px-5 sm:px-6 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">
                Revenue over time
              </h2>

              <p className="text-xs text-text-muted mt-0.5">
                Daily revenue generated from your orders.
              </p>
            </div>

            {analytics.chartData.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Revenue
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 sm:p-6">
          {analytics.chartData.length ? (
            <ResponsiveContainer
              width="100%"
              height={340}
            >
              <LineChart
                data={analytics.chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 5,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  stroke="var(--text-muted)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  dy={8}
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
                    stroke: 'var(--border)',
                    strokeDasharray: '4 4',
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: 'var(--accent)',
                    strokeWidth: 0,
                  }}
                  activeDot={{
                    r: 5,
                    fill: 'var(--accent)',
                    strokeWidth: 0,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[340px] flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-text-muted" />
              </div>

              <h3 className="text-sm font-semibold text-text-primary">
                No sales data yet
              </h3>

              <p className="text-xs text-text-muted mt-1 max-w-sm">
                Once your store receives orders, your revenue
                trends will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insight note */}
      {analytics.chartData.length > 0 && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text-primary">
              Sales overview:
            </span>{' '}
            Your analytics are calculated from the orders currently
            available for your store.
          </p>
        </div>
      )}
    </div>
  );
}