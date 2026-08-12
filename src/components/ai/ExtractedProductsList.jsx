import { CheckCircle2 } from 'lucide-react';

export default function ExtractedProductsList({ products }) {
  if (!products?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((product, index) => {
        const quantity = product.quantity
          ? `${product.quantity}${product.unit && product.unit !== 'piece' ? ` ${product.unit}` : ''}`
          : '';

        return (
          <span
            key={`${product.name}-${index}`}
            className="inline-flex items-center gap-1.5 bg-accent-soft border border-accent/15 text-accent text-sm font-medium px-3 py-1.5 rounded-full"
          >
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />

            <span className="text-text-primary">
              {product.name}
            </span>

            {quantity && (
              <span className="font-nums text-accent">
                {quantity}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}