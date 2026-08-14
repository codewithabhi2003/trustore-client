import {
  Sparkles,
  ShoppingBag,
  MapPin,
} from 'lucide-react';

import AIShoppingAssistant from '../../components/ai/AIShoppingAssistant';

export default function ShopAI() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Page header */}
      <div className="mb-6">

        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            AI shopping
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">

          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
              Shop with AI
            </h1>

            <p className="text-sm text-text-muted mt-1.5 max-w-2xl">
              Tell us what you need in natural language and
              we'll help you find the right products from
              nearby stores.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-[11px] font-medium text-text-secondary">
              <MapPin className="w-3 h-3 text-accent" />
              Nearby stores
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-[11px] font-medium text-text-secondary">
              <ShoppingBag className="w-3 h-3 text-accent" />
              Smart recommendations
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">
        <AIShoppingAssistant />
      </div>

    </div>
  );
}