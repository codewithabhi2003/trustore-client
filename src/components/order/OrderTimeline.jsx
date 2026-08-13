import {
  CreditCard,
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  Clock3,
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const STEPS = [
  { key: 'Order Placed', label: 'Pending', icon: CreditCard },
  { key: 'Accepted', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Preparing', label: 'Packed', icon: PackageCheck },
  { key: 'Ready for Pickup', label: 'Shipped', icon: Truck },
  { key: 'Completed', label: 'Delivered', icon: Home },
];

export default function OrderTimeline({ status, statusHistory = [] }) {
  if (status === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 rounded-xl bg-accent-red/10 border border-accent-red/15 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-accent-red/10 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-4 h-4 text-accent-red" />
        </div>

        <div>
          <p className="text-sm font-semibold text-accent-red">
            Order cancelled
          </p>
          <p className="text-xs text-text-muted mt-0.5">
            This order is no longer being processed.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div>
      <div className="overflow-x-auto scrollbar-none pb-2">
        <div className="flex items-start min-w-[520px]">
          {STEPS.map((step, i) => {
            const completed = i < safeIndex;
            const active = i === safeIndex;
            const done = i <= safeIndex;
            const Icon = step.icon;

            return (
              <div
                key={step.key}
                className="flex items-start flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center w-20 flex-shrink-0">
                  <div
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      active
                        ? 'bg-accent text-white shadow-glow ring-4 ring-accent/10'
                        : completed
                          ? 'bg-accent text-white'
                          : 'bg-input text-text-muted border border-border'
                    }`}
                  >
                    <Icon
                      className="w-4 h-4"
                      strokeWidth={active ? 2.5 : 2}
                    />

                    {active && (
                      <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-20" />
                    )}
                  </div>

                  <p
                    className={`text-[11px] text-center leading-tight mt-2 ${
                      done
                        ? 'text-text-primary font-semibold'
                        : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </p>

                  <p
                    className={`text-[9px] mt-0.5 text-center ${
                      active
                        ? 'text-accent font-semibold'
                        : 'text-text-muted'
                    }`}
                  >
                    {active
                      ? 'Current'
                      : completed
                        ? 'Complete'
                        : 'Upcoming'}
                  </p>
                </div>

                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-1 mt-5 mx-1 rounded-full bg-input overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        i < safeIndex ? 'w-full bg-accent' : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {statusHistory.length > 0 && (
        <div className="border-t border-border mt-5 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock3 className="w-4 h-4 text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-text-primary">
              Order history
            </h3>
          </div>

          <div className="relative space-y-4 pl-1">
            {[...statusHistory]
              .reverse()
              .map((history, index) => {
                const step = STEPS.find(
                  (item) => item.key === history.status
                );

                return (
                  <div
                    key={`${history.status}-${history.updatedAt}-${index}`}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                        {step ? (
                          <step.icon className="w-3.5 h-3.5 text-accent" />
                        ) : (
                          <Clock3 className="w-3.5 h-3.5 text-accent" />
                        )}
                      </div>

                      <span className="text-sm font-medium text-text-secondary truncate">
                        {step?.label || history.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-text-muted font-nums whitespace-nowrap">
                      {formatDate(history.updatedAt)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}