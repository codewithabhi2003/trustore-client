import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Menu,
  X,
  Sparkles,
  Store,
  User,
  Heart,
  Settings as SettingsIcon,
  LogOut,
  Package,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import NotificationBell from './NotificationBell';

const navLink = ({ isActive }) =>
  `relative text-sm font-medium transition-colors ${
    isActive
      ? 'text-accent'
      : 'text-text-secondary hover:text-text-primary'
  }`;

const menuItem =
  'flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    setOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-base/90 backdrop-blur-xl border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5 font-heading font-extrabold text-xl text-text-primary shrink-0"
        >
          <span className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-white text-base shadow-sm">
            🛒
          </span>

          <span>Trustore</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/shop-ai" className={navLink}>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Shop with AI
            </span>
          </NavLink>

          <NavLink to="/stores" className={navLink}>
            Browse Stores
          </NavLink>

          {user?.role === 'storeOwner' && (
            <NavLink
              to="/store-owner/dashboard"
              className={navLink}
            >
              Store Dashboard
            </NavLink>
          )}

          {user?.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={navLink}
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Notifications */}
          <NotificationBell />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-elevated transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5 text-text-primary" />

            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center font-nums border-2 border-base">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Desktop Account */}
          {user ? (
            <div
              className="relative hidden sm:block"
              ref={profileRef}
            >
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="h-9 rounded-full px-2.5 flex items-center gap-1.5 hover:bg-elevated transition-colors"
                aria-label="Account menu"
                aria-expanded={profileOpen}
              >
                <span className="w-7 h-7 rounded-full bg-accent-soft flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                    profileOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-2xl shadow-lg overflow-hidden py-1.5">

                  {/* Account Header */}
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {user.name || 'Account'}
                    </p>

                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className={menuItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  {user.role === 'customer' && (
                    <Link
                      to="/orders"
                      className={menuItem}
                      onClick={() => setProfileOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      My Orders
                    </Link>
                  )}

                  <Link
                    to="/wishlist"
                    className={menuItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </Link>

                  <Link
                    to="/settings"
                    className={menuItem}
                    onClick={() => setProfileOpen(false)}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Settings
                  </Link>

                  <div className="border-t border-border my-1.5" />

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={`${menuItem} w-full text-left text-accent-red hover:bg-accent-red/10`}
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors shadow-sm"
            >
              Sign in
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-elevated transition-colors"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-text-primary" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/30 backdrop-blur-[1px] z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Mobile navigation panel */}
          <div className="relative z-50 md:hidden bg-base border-t border-border shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-5">

              {/* Main navigation */}
              <div className="space-y-1">

                <NavLink
                  to="/shop-ai"
                  className={({ isActive }) =>
                    `${navLink({
                      isActive,
                    })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                  }
                  onClick={closeMobileMenu}
                >
                  <Sparkles className="w-4 h-4" />
                  Shop with AI
                </NavLink>

                <NavLink
                  to="/stores"
                  className={({ isActive }) =>
                    `${navLink({
                      isActive,
                    })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                  }
                  onClick={closeMobileMenu}
                >
                  <Store className="w-4 h-4" />
                  Browse Stores
                </NavLink>

                {user?.role === 'storeOwner' && (
                  <NavLink
                    to="/store-owner/dashboard"
                    className={({ isActive }) =>
                      `${navLink({
                        isActive,
                      })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                    }
                    onClick={closeMobileMenu}
                  >
                    <Store className="w-4 h-4" />
                    Store Dashboard
                  </NavLink>
                )}

                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) =>
                      `${navLink({
                        isActive,
                      })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                    }
                    onClick={closeMobileMenu}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    Admin Dashboard
                  </NavLink>
                )}
              </div>

              {/* Account section */}
              {user && (
                <div className="border-t border-border mt-4 pt-4">
                  <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                    Account
                  </p>

                  <div className="space-y-1">
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `${navLink({
                          isActive,
                        })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                      }
                      onClick={closeMobileMenu}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </NavLink>

                    {user.role === 'customer' && (
                      <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                          `${navLink({
                            isActive,
                          })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                        }
                        onClick={closeMobileMenu}
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </NavLink>
                    )}

                    <NavLink
                      to="/wishlist"
                      className={({ isActive }) =>
                        `${navLink({
                          isActive,
                        })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                      }
                      onClick={closeMobileMenu}
                    >
                      <Heart className="w-4 h-4" />
                      Wishlist
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className={({ isActive }) =>
                        `${navLink({
                          isActive,
                        })} flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-elevated`
                      }
                      onClick={closeMobileMenu}
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </NavLink>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full mt-3 flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-accent-red hover:bg-accent-red/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}

              {/* Guest sign in */}
              {!user && (
                <div className="border-t border-border mt-4 pt-4">
                  <Link
                    to="/login"
                    className="w-full inline-flex items-center justify-center px-5 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}