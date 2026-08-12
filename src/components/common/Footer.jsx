import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Heart,
  Sparkles,
  Store,
  ShoppingBag,
  Package,
} from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Main footer */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 font-heading font-extrabold text-xl text-text-primary"
            >
              <span className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white text-base shadow-glow">
                🛒
              </span>
              Trustore
            </Link>

            <p className="text-sm text-text-secondary leading-relaxed mt-4 max-w-xs">
              Your smarter way to shop local. Discover trusted stores,
              find what you need, and shop with confidence.
            </p>

            <Link
              to="/shop-ai"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Shop with AI
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Shop
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/shop-ai"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Shopping Assistant
                </Link>
              </li>

              <li>
                <Link
                  to="/stores"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <Store className="w-3.5 h-3.5" />
                  Browse Stores
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* For Stores */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              For Stores
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/store-register"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Register your store
                </Link>
              </li>

              <li>
                <Link
                  to="/store-owner/dashboard"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Store dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/store-owner/orders"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Manage orders
                </Link>
              </li>

              <li>
                <Link
                  to="/store-owner/products"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Manage products
                </Link>
              </li>
            </ul>
          </div>

          {/* Trustore */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">
              Trustore
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  About Trustore
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Support
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Privacy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>
            © {year} Trustore. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5">
            Built for local shopping
            <Heart className="w-3.5 h-3.5 text-accent-red fill-accent-red" />
          </p>
        </div>
      </div>
    </footer>
  );
}