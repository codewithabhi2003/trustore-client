import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Sun,
  Moon,
  Bell,
  MapPin,
  User,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  Settings as SettingsIcon,
} from 'lucide-react';

import Button from '../../components/common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const NOTIF_KEY = 'trustore-notification-prefs';

const defaultPrefs = {
  orderUpdates: true,
};

function loadPrefs() {
  try {
    const stored = JSON.parse(
      localStorage.getItem(NOTIF_KEY)
    );

    return {
      ...defaultPrefs,
      ...(stored || {}),
    };
  } catch {
    return defaultPrefs;
  }
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        checked
          ? 'bg-accent'
          : 'bg-input'
      }`}
      aria-pressed={checked}
      aria-label={
        checked
          ? 'Disable setting'
          : 'Enable setting'
      }
    >
      <span
        className={`absolute left-0.5 top-1/2 w-5 h-5 rounded-full bg-white shadow-sm transition-transform -translate-y-1/2 ${
          checked
            ? 'translate-x-5'
            : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  show,
  onToggle,
}) {
  return (
    <div className="relative">
      <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-input border border-border rounded-lg pl-10 pr-11 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
      />

      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
        aria-label={
          show
            ? 'Hide password'
            : 'Show password'
        }
      >
        {show ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [prefs, setPrefs] = useState(loadPrefs);

  const [passwords, setPasswords] =
    useState({
      current: '',
      next: '',
    });

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const updatePref = (key, value) => {
    const next = {
      ...prefs,
      [key]: value,
    };

    setPrefs(next);

    localStorage.setItem(
      NOTIF_KEY,
      JSON.stringify(next)
    );
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwords.current) {
      toast.error(
        'Enter your current password'
      );
      return;
    }

    if (passwords.next.length < 6) {
      toast.error(
        'New password should be at least 6 characters'
      );
      return;
    }

    setChangingPassword(true);

    try {
      await api.put('/users/password', {
        currentPassword:
          passwords.current,
        newPassword:
          passwords.next,
      });

      toast.success(
        'Password updated successfully'
      );

      setPasswords({
        current: '',
        next: '',
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update your password.'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Preferences
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Settings
        </h1>

        <p className="text-sm text-text-muted mt-1.5">
          Manage your appearance, notifications,
          account and security preferences.
        </p>
      </div>

      <div className="space-y-4">

        {/* Appearance */}
        <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Appearance
            </h2>

            <p className="text-[11px] text-text-muted mt-0.5">
              Customize how Trustore looks on your device.
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-accent" />
                  ) : (
                    <Sun className="w-4 h-4 text-accent" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Dark mode
                  </p>

                  <p className="text-xs text-text-muted mt-0.5">
                    {theme === 'dark'
                      ? 'Dark theme is currently enabled'
                      : 'Use a darker interface'}
                  </p>
                </div>
              </div>

              <Toggle
                checked={theme === 'dark'}
                onChange={toggleTheme}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Notifications
            </h2>

            <p className="text-[11px] text-text-muted mt-0.5">
              Choose which updates you'd like to receive.
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                  <Bell className="w-4 h-4 text-accent" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Order status updates
                  </p>

                  <p className="text-xs text-text-muted mt-0.5">
                    Get notified as your order moves along.
                  </p>
                </div>
              </div>

              <Toggle
                checked={prefs.orderUpdates}
                onChange={(value) =>
                  updatePref(
                    'orderUpdates',
                    value
                  )
                }
              />
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-text-primary">
              Account
            </h2>

            <p className="text-[11px] text-text-muted mt-0.5">
              Manage your profile and delivery information.
            </p>
          </div>

          <div className="p-3">

            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-elevated transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <User className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Edit profile
                </p>

                <p className="text-xs text-text-muted mt-0.5">
                  Update your name and phone number
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </Link>

            <Link
              to="/addresses"
              className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-elevated transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                <MapPin className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Manage addresses
                </p>

                <p className="text-xs text-text-muted mt-0.5">
                  Add or update your delivery addresses
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
            </Link>
          </div>
        </section>

        {/* Security */}
        <section className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-accent" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-text-primary">
                  Security
                </h2>

                <p className="text-[11px] text-text-muted mt-0.5">
                  Keep your account protected.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="p-5 space-y-4"
          >
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Current password
              </label>

              <PasswordInput
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    current: e.target.value,
                  })
                }
                placeholder="Enter current password"
                show={showCurrentPassword}
                onToggle={() =>
                  setShowCurrentPassword(
                    (value) => !value
                  )
                }
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                New password
              </label>

              <PasswordInput
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    next: e.target.value,
                  })
                }
                placeholder="Enter new password"
                show={showNewPassword}
                onToggle={() =>
                  setShowNewPassword(
                    (value) => !value
                  )
                }
              />

              <p className="text-[11px] text-text-muted mt-1.5">
                Your new password must contain at least 6 characters.
              </p>
            </div>

            <Button
              type="submit"
              size="sm"
              loading={changingPassword}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Update password
            </Button>
          </form>
        </section>

        {/* Sign out */}
        <section className="bg-card border border-accent-red/20 rounded-card shadow-sm p-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-text-primary">
                Sign out
              </p>

              <p className="text-xs text-text-muted mt-0.5">
                Sign out of your Trustore account on this device.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}