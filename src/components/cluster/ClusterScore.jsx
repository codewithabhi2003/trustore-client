const rows = [
  { key: 'availabilityScore', label: 'Product availability', color: 'bg-accent' },
  { key: 'distanceScore', label: 'Distance score', color: 'bg-accent-blue' },
  { key: 'efficiencyScore', label: 'Delivery efficiency', color: 'bg-accent-orange' },
  { key: 'ratingScore', label: 'Store ratings', color: 'bg-accent-yellow' },
];

export default function ClusterScore({ cluster }) {
  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-3">
          <span className="text-xs text-text-secondary w-36 flex-shrink-0">{row.label}</span>
          <div className="flex-1 h-2 rounded-full bg-input overflow-hidden">
            <div
              className={`h-full rounded-full ${row.color} transition-all duration-500`}
              style={{ width: `${cluster[row.key] ?? 0}%` }}
            />
          </div>
          <span className="text-xs font-nums font-semibold text-text-primary w-9 text-right">
            {cluster[row.key] ?? 0}%
          </span>
        </div>
      ))}
    </div>
  );
}
