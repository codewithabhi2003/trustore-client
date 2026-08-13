import { Link } from 'react-router-dom';
import {
  Compass,
  Home,
  ArrowLeft,
} from 'lucide-react';

import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-20 sm:py-28">

      <div className="bg-card border border-border rounded-card shadow-sm p-8 sm:p-10 text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-accent-soft flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-accent" />
        </div>

        {/* Error code */}
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-2">
          Error 404
        </p>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-text-primary">
          Page not found
        </h1>

        <p className="text-sm text-text-secondary leading-relaxed mt-3 max-w-sm mx-auto">
          The page you're looking for doesn't exist,
          may have moved, or the link might be incorrect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">

          <Link to="/">
            <Button>
              <Home className="w-4 h-4" />
              Back to home
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-input text-text-secondary text-sm font-semibold hover:bg-elevated hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </button>

        </div>

      </div>

      {/* Helpful links */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-text-muted">
        <Link
          to="/stores"
          className="hover:text-accent transition-colors"
        >
          Browse stores
        </Link>

        <span>•</span>

        <Link
          to="/shop-ai"
          className="hover:text-accent transition-colors"
        >
          Shop with AI
        </Link>
      </div>

    </div>
  );
}