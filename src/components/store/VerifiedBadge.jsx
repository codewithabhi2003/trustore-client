import { BadgeCheck } from 'lucide-react';

export default function VerifiedBadge({ size = 'sm' }) {
  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-accent-soft text-accent font-semibold border border-accent/10 ${
        isSmall
          ? 'text-[11px] px-2 py-0.5'
          : 'text-xs px-2.5 py-1'
      }`}
    >
      <BadgeCheck
        className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'}
        strokeWidth={2.5}
      />
      Verified
    </span>
  );
}