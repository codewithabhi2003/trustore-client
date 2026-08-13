import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  BarChart3,
  UserRound,
  ClipboardList,
} from 'lucide-react';

import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/dashboard-stats')
      .then((res) => {
        setStats(res.data.stats || res.data);
      })
      .catch(() => {
        setStats({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading admin dashboard..."
      />
    );
  }

  const cards = [
    {
      icon: Users,
      label: 'Total customers',
      value: stats?.totalUsers ?? '—',
      description: 'Registered customers',
    },
    {
      icon: Store,
      label: 'Verified stores',
      value: stats?.totalStores ?? '—',
      description: 'Active stores on platform',
    },
    {
      icon: ShoppingBag,
      label: 'Total orders',
      value: stats?.totalOrders ?? '—',
      description: 'Orders across the platform',
    },
    {
      icon: Wallet,
      label: 'Platform revenue',
      value:
        stats?.totalRevenue != null
          ? formatPrice(stats.totalRevenue)
          : '—',
      description: 'Revenue generated',
    },
  ];

  const actions = [
    {
      to: '/admin/stores/pending',
      icon: ShieldCheck,
      label: 'Store verifications',
      description:
        'Review and approve pending store registrations.',
    },
    {
      to: '/admin/customers',
      icon: UserRound,
      label: 'Manage customers',
      description:
        'View and manage registered customer accounts.',
    },
    {
      to: '/admin/orders',
      icon: ClipboardList,
      label: 'Platform orders',
      description:
        'Review orders placed across all stores.',
    },
    {
      to: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics',
      description:
        'View platform-wide performance and trends.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              Platform administration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Admin dashboard
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Monitor Trustore activity and manage stores,
            customers, orders and platform performance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full bg-accent" />
          Platform overview
        </div>
      </div>

      {/* Overview */}
      <div className="bg-card border border-border rounded-card shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-accent" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Platform overview
            </h2>

            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              A quick view of your customers, verified stores,
              orders and revenue across Trustore.
            </p>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-7">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-card border border-border rounded-card shadow-sm p-4 sm:p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
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

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">
            Quick actions
          </h2>

          <p className="text-xs text-text-muted mt-0.5">
            Manage the main areas of your platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.to}
                to={action.to}
                className="group p-5 sm:p-6 hover:bg-surface transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center">
                    <Icon className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </div>

                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                </div>

                <h3 className="text-sm font-semibold text-text-primary mt-4">
                  {action.label}
                </h3>

                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
        <p className="text-xs text-text-muted">
          <span className="font-semibold text-text-primary">
            Admin access:
          </span>{' '}
          Use these tools to review platform activity and
          maintain Trustore operations.
        </p>
      </div>
    </div>
  );
}