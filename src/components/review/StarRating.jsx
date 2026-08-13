import { Star } from 'lucide-react';

export default function StarRating({
  value = 0,
  onChange,
  size = 'md',
  readOnly = false,
}) {
  const dim =
    size === 'sm'
      ? 'w-3.5 h-3.5'
      : size === 'lg'
        ? 'w-6 h-6'
        : 'w-5 h-5';

  return (
    <div
      className="inline-flex items-center gap-0.5"
      role={readOnly ? undefined : 'radiogroup'}
      aria-label="Star rating"
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;

        return (
          <button
            key={n}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(n)}
            className={`p-0.5 rounded-sm transition-all duration-150 ${
              readOnly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-110'
            }`}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            aria-checked={value === n}
            role={readOnly ? undefined : 'radio'}
          >
            <Star
              className={`${dim} transition-colors ${
                active
                  ? 'text-accent-yellow fill-accent-yellow'
                  : 'text-border-strong'
              }`}
              strokeWidth={1.8}
            />
          </button>
        );
      })}
    </div>
  );
}
