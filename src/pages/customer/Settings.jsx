import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sun, Moon, Bell, MapPin, User, LogOut, KeyRound } from 'lucide-react';
import Button from '../../components/common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const NOTIF_KEY = 'trustore-notification-prefs';
const defaultPrefs = { orderUpdates: true, promotions: false };

function loadPrefs() {
  try {
    return { ...defaultPrefs, ...JSON.parse(localStorage.getItem(NOTIF_KEY)) };
  } catch {
    return defaultPrefs;
  }
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-input'}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute left-0.5 top-1/2 w-5 h-5 rounded-full bg-white shadow-sm transition-transform -translate-y-1/2 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(loadPrefs);
  const [passwords, setPasswords] = useState({ current: '', next: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const updatePref = (key, value) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.next.length < 6) {
      toast.error('New password should be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await api.put('/users/password', { currentPassword: passwords.current, newPassword: passwords.next });
      toast.success('Password updated');
      setPasswords({ current: '', next: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update your password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary">Settings</h1>

      {/* Appearance */}
      <section className="bg-card border border-border rounded-card shadow-sm p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Dark mode</p>
              <p className="text-xs text-text-muted">Switch between light and dark themes</p>
            </div>
          </div>
          <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-card shadow-sm p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
                <Bell className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Order status updates</p>
                <p className="text-xs text-text-muted">Get notified as your order moves along</p>
              </div>
            </div>
            <Toggle checked={prefs.orderUpdates} onChange={(v) => updatePref('orderUpdates', v)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
                <Bell className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Promotions & offers</p>
                <p className="text-xs text-text-muted">Occasional deals from nearby stores</p>
              </div>
            </div>
            <Toggle checked={prefs.promotions} onChange={(v) => updatePref('promotions', v)} />
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="bg-card border border-border rounded-card shadow-sm p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-4">Account</h2>
        <div className="space-y-2 mb-5">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-elevated transition-colors text-sm text-text-secondary"
          >
            <User className="w-4 h-4" /> Edit profile
          </Link>
          <Link
            to="/addresses"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-elevated transition-colors text-sm text-text-secondary"
          >
            <MapPin className="w-4 h-4" /> Manage addresses
          </Link>
        </div>

        <form onSubmit={handleChangePassword} className="border-t border-border pt-4 space-y-3">
          <p className="text-sm font-medium text-text-primary flex items-center gap-2">
            <KeyRound className="w-4 h-4" /> Change password
          </p>
          <input
            type="password"
            placeholder="Current password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwords.next}
            onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <Button type="submit" size="sm" loading={changingPassword}>
            Update password
          </Button>
        </form>
      </section>

      <Button variant="danger" className="w-full" onClick={handleSignOut}>
        <LogOut className="w-4 h-4" /> Sign out
      </Button>
    </div>
  );
}