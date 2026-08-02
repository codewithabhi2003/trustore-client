import { CreditCard, CheckCircle2, PackageCheck, Truck, Home } from 'lucide-react';
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
    return <p className="text-sm text-accent-red font-medium">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div>
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const done = i <= currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    done ? 'bg-accent text-white' : 'bg-input text-text-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] text-center w-16 ${done ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 -mt-4 ${i < currentIndex ? 'bg-accent' : 'bg-input'}`} />
              )}
            </div>
          );
        })}
      </div>

      {statusHistory.length > 0 && (
        <div className="border-t border-border mt-5 pt-4 space-y-2">
          {[...statusHistory].reverse().map((h, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{STEPS.find((s) => s.key === h.status)?.label || h.status}</span>
              <span className="text-text-muted text-xs font-nums">{formatDate(h.updatedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}