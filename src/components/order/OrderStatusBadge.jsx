const styles = {
  'Order Placed': 'bg-accent-blue/10 text-accent-blue',
  Accepted: 'bg-accent-yellow/10 text-accent-yellow',
  Preparing: 'bg-accent-orange/10 text-accent-orange',
  'Ready for Pickup': 'bg-accent/10 text-accent',
  Completed: 'bg-accent/15 text-accent-dark',
  Cancelled: 'bg-accent-red/10 text-accent-red',
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status] || 'bg-input text-text-secondary'}`}>
      {status}
    </span>
  );
}
