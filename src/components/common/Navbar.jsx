import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sparkles, Store, User, Heart, Settings as SettingsIcon, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import NotificationBell from './NotificationBell';

const navLink = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
  }`;

const menuItem =
  'flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-base/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-extrabold text-xl">
          <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm">
            🛒
          </span>
          Trustore
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/shop-ai" className={navLink}>
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Shop with AI
            </span>
          </NavLink>
          <NavLink to="/stores" className={navLink}>
            Browse Stores
          </NavLink>
          {user?.role === 'storeOwner' && (
            <NavLink to="/store-owner/dashboard" className={navLink}>
              Store Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin/dashboard" className={navLink}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />

          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-elevated transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-text-primary" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] px-1 rounded-full bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center font-nums">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative hidden sm:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="p-2 rounded-full hover:bg-elevated transition-colors"
                aria-label="Account menu"
                aria-expanded={profileOpen}
              >
                <User className="w-5 h-5 text-text-primary" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-card shadow-lg overflow-hidden py-1">
                  <Link to="/profile" className={menuItem} onClick={() => setProfileOpen(false)}>
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  {user.role === 'customer' && (
                    <Link to="/orders" className={menuItem} onClick={() => setProfileOpen(false)}>
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                  )}
                  <Link to="/wishlist" className={menuItem} onClick={() => setProfileOpen(false)}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link to="/settings" className={menuItem} onClick={() => setProfileOpen(false)}>
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </Link>
                  <div className="border-t border-border my-1" />
                  <button onClick={handleSignOut} className={`${menuItem} w-full text-left text-accent-red`}>
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              Sign in
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-full hover:bg-elevated"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-base px-4 py-4 flex flex-col gap-4">
          <NavLink to="/shop-ai" className={navLink} onClick={() => setOpen(false)}>
            Shop with AI
          </NavLink>
          <NavLink to="/stores" className={navLink} onClick={() => setOpen(false)}>
            Browse Stores
          </NavLink>
          {user?.role === 'storeOwner' && (
            <NavLink to="/store-owner/dashboard" className={navLink} onClick={() => setOpen(false)}>
              <Store className="w-4 h-4 inline mr-1" /> Store Dashboard
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <NavLink to="/admin/dashboard" className={navLink} onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          {user && (
            <>
              <NavLink to="/profile" className={navLink} onClick={() => setOpen(false)}>
                My Profile
              </NavLink>
              {user.role === 'customer' && (
                <NavLink to="/orders" className={navLink} onClick={() => setOpen(false)}>
                  My Orders
                </NavLink>
              )}
              <NavLink to="/wishlist" className={navLink} onClick={() => setOpen(false)}>
                Wishlist
              </NavLink>
              <NavLink to="/settings" className={navLink} onClick={() => setOpen(false)}>
                Settings
              </NavLink>
            </>
          )}
          {!user && (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-full bg-accent text-white text-sm font-semibold text-center"
              onClick={() => setOpen(false)}
            >
              Sign in
            </Link>
          )}
          {user && (
            <button
              onClick={() => {
                logout();
                setOpen(false);
                navigate('/');
              }}
              className="text-left text-sm font-medium text-accent-red"
            >
              Sign out
            </button>
          )}
        </div>
      )}
    </header>
  );
}