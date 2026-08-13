import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  Search,
  ArrowLeft,
  UserCheck,
  UserX,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get('/admin/customers')
      .then((res) => {
        setCustomers(
          res.data.customers || res.data || []
        );
      })
      .catch(() => {
        setCustomers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleBlock = async (customer) => {
    if (updatingId) return;

    setUpdatingId(customer._id);

    try {
      await api.patch(
        `/admin/customer/${customer._id}/block`
      );

      setCustomers((prev) =>
        prev.map((item) =>
          item._id === customer._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );

      toast.success(
        customer.isActive
          ? 'Customer blocked'
          : 'Customer unblocked'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update this customer.'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.name, customer.email]
        .filter(Boolean)
        .some((value) =>
          value
            .toLowerCase()
            .includes(normalizedQuery)
        )
    );
  }, [customers, query]);

  const activeCustomers = customers.filter(
    (customer) => customer.isActive
  ).length;

  const blockedCustomers = customers.filter(
    (customer) => !customer.isActive
  ).length;

  if (loading) {
    return (
      <Loader
        fullScreen
        label="Loading customers..."
      />
    );
  }

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
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wide text-accent">
              User administration
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
            Manage customers
          </h1>

          <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
            Review customer accounts and manage their access
            to the Trustore platform.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search name or email..."
            className="w-full pl-9 pr-4 py-2.5 bg-input border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-accent transition-colors"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      {customers.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-7">

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Users className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary">
              {customers.length}
            </p>

            <p className="text-xs font-medium text-text-primary mt-1">
              Total customers
            </p>

            <p className="text-[11px] text-text-muted mt-0.5">
              Registered accounts
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <UserCheck className="w-4 h-4 text-accent" />
            </div>

            <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary">
              {activeCustomers}
            </p>

            <p className="text-xs font-medium text-text-primary mt-1">
              Active customers
            </p>

            <p className="text-[11px] text-text-muted mt-0.5">
              Accounts with access
            </p>
          </div>

          <div className="bg-card border border-border rounded-card shadow-sm p-4">
            <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center mb-4">
              <UserX className="w-4 h-4 text-accent-red" />
            </div>

            <p className="text-xl sm:text-2xl font-nums font-extrabold text-text-primary">
              {blockedCustomers}
            </p>

            <p className="text-xs font-medium text-text-primary mt-1">
              Blocked customers
            </p>

            <p className="text-[11px] text-text-muted mt-0.5">
              Accounts without access
            </p>
          </div>
        </div>
      )}

      {/* Search result info */}
      {query && customers.length > 0 && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-text-muted">
            Showing{' '}
            <span className="font-semibold text-text-primary">
              {filtered.length}
            </span>{' '}
            result{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-card shadow-sm">
          <EmptyState
            icon={UserRound}
            title={
              query
                ? 'No customers found'
                : 'No customers yet'
            }
            description={
              query
                ? 'Try searching with a different name or email address.'
                : 'Registered customer accounts will appear here.'
            }
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          {/* Table heading */}
          <div className="px-5 sm:px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Customer accounts
            </h2>

            <p className="text-xs text-text-muted mt-0.5">
              Manage access for registered customers.
            </p>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-text-muted text-[10px] uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">
                    Customer
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Email
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Joined
                  </th>

                  <th className="text-left px-4 py-3 font-semibold">
                    Status
                  </th>

                  <th className="text-right px-5 py-3 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((customer) => {
                  const isUpdating =
                    updatingId === customer._id;

                  return (
                    <tr
                      key={customer._id}
                      className="border-t border-border hover:bg-surface/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                            <UserRound className="w-3.5 h-3.5 text-text-muted" />
                          </div>

                          <span className="font-medium text-text-primary">
                            {customer.name || 'Unnamed customer'}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="text-text-secondary">
                          {customer.email || '—'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-text-muted">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                            customer.isActive
                              ? 'bg-accent/10 text-accent'
                              : 'bg-accent-red/10 text-accent-red'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              customer.isActive
                                ? 'bg-accent'
                                : 'bg-accent-red'
                            }`}
                          />

                          {customer.isActive
                            ? 'Active'
                            : 'Blocked'}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            toggleBlock(customer)
                          }
                          disabled={isUpdating}
                          className={`text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            customer.isActive
                              ? 'text-accent-red hover:text-accent-red/80'
                              : 'text-accent hover:text-accent-dark'
                          }`}
                        >
                          {isUpdating
                            ? 'Updating...'
                            : customer.isActive
                              ? 'Block'
                              : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((customer) => {
              const isUpdating =
                updatingId === customer._id;

              return (
                <div
                  key={customer._id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center shrink-0">
                        <UserRound className="w-4 h-4 text-text-muted" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary truncate">
                          {customer.name ||
                            'Unnamed customer'}
                        </p>

                        <p className="text-xs text-text-muted truncate mt-0.5">
                          {customer.email || '—'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold shrink-0 ${
                        customer.isActive
                          ? 'bg-accent/10 text-accent'
                          : 'bg-accent-red/10 text-accent-red'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          customer.isActive
                            ? 'bg-accent'
                            : 'bg-accent-red'
                        }`}
                      />

                      {customer.isActive
                        ? 'Active'
                        : 'Blocked'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-text-muted">
                        Joined
                      </p>

                      <p className="text-xs text-text-secondary mt-0.5">
                        {formatDate(
                          customer.createdAt
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleBlock(customer)
                      }
                      disabled={isUpdating}
                      className={`text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
                        customer.isActive
                          ? 'text-accent-red'
                          : 'text-accent'
                      }`}
                    >
                      {isUpdating
                        ? 'Updating...'
                        : customer.isActive
                          ? 'Block customer'
                          : 'Unblock customer'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer note */}
      {customers.length > 0 && (
        <div className="mt-4 px-4 py-3 rounded-xl bg-surface border border-border">
          <p className="text-xs text-text-muted">
            <span className="font-semibold text-text-primary">
              Customer management:
            </span>{' '}
            Blocking an account removes its access according to
            your platform's account rules. You can restore access
            using the same action.
          </p>
        </div>
      )}
    </div>
  );
}