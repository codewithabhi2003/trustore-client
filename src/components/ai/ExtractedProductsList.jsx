import { CheckCircle2 } from 'lucide-react';

export default function ExtractedProductsList({ products }) {
  if (!products?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((p, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 bg-accent-soft text-accent text-sm font-medium px-3 py-1.5 rounded-full"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {p.name} {p.quantity ? `${p.quantity}${p.unit && p.unit !== 'piece' ? p.unit : ''}` : ''}
        </span>
      ))}
    </div>
  );
}
