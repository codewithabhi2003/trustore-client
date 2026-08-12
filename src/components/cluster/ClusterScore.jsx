const rows = [
  { key: 'availabilityScore', label: 'Product availability', color: 'bg-accent' },
  { key: 'distanceScore', label: 'Distance score', color: 'bg-accent-blue' },
  { key: 'efficiencyScore', label: 'Delivery efficiency', color: 'bg-accent-orange' },
  { key: 'ratingScore', label: 'Store ratings', color: 'bg-accent-yellow' },
];

export default function ClusterScore({ cluster }) {
  if (!cluster) return null;

  return (
    <div className="space-y-2.5">
      {rows.map((row) => {
        const score = Math.min(100, Math.max(0, Number(cluster[row.key]) || 0));

        return (
          <div key={row.key} className="flex items-center gap-3">
            <span className="w-36 flex-shrink-0 text-xs text-text-secondary">
              {row.label}
            </span>

            <div className="flex-1 h-2 rounded-full bg-input overflow-hidden">
              <div
                className={`h-full rounded-full ${row.color} transition-all duration-500`}
                style={{ width: `${score}%` }}
              />
            </div>

            <span className="w-9 text-right text-xs font-nums font-semibold text-text-primary">
              {score}%
            </span>
          </div>
        );
      })}
    </div>
  );
}