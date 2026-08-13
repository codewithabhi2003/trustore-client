import {
  CreditCard,
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  XCircle,
} from 'lucide-react';

const styles = {
  'Order Placed': {
    className: 'bg-accent-blue/10 text-accent-blue border-accent-blue/15',
    icon: CreditCard,
  },
  Accepted: {
    className: 'bg-accent-yellow/10 text-accent-yellow border-accent-yellow/15',
    icon: CheckCircle2,
  },
  Preparing: {
    className: 'bg-accent-orange/10 text-accent-orange border-accent-orange/15',
    icon: PackageCheck,
  },
  'Ready for Pickup': {
    className: 'bg-accent/10 text-accent border-accent/15',
    icon: Truck,
  },
  Completed: {
    className: 'bg-accent/15 text-accent-dark border-accent/20',
    icon: Home,
  },
  Cancelled: {
    className: 'bg-accent-red/10 text-accent-red border-accent-red/15',
    icon: XCircle,
  },
};

export default function OrderStatusBadge({ status }) {
  const config = styles[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-input text-text-secondary border border-border">
        {status || 'Unknown'}
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.2} />
      {status}
    </span>
  );
}