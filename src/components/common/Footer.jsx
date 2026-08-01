import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 font-heading font-extrabold text-lg mb-2">
            <span className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-xs">
              🛒
            </span>
            Trustore
          </div>
          <p className="text-sm text-text-secondary">Shop only from trusted local stores.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link to="/shop-ai" className="hover:text-accent">AI Shopping Assistant</Link></li>
            <li><Link to="/stores" className="hover:text-accent">Browse Stores</Link></li>
            <li><Link to="/orders" className="hover:text-accent">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">For Stores</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><Link to="/store-register" className="hover:text-accent">Register your store</Link></li>
            <li><Link to="/store-owner/dashboard" className="hover:text-accent">Store dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-text-primary mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li><a href="#" className="hover:text-accent">About</a></li>
            <li><a href="#" className="hover:text-accent">Support</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-text-muted">
        © {new Date().getFullYear()} Trustore. All rights reserved.
      </div>
    </footer>
  );
}
