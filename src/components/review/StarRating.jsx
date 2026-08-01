import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const dim = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          className={readOnly ? 'cursor-default' : 'cursor-pointer'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star
            className={`${dim} ${n <= value ? 'text-accent-yellow fill-accent-yellow' : 'text-border-strong'}`}
          />
        </button>
      ))}
    </div>
  );
}
