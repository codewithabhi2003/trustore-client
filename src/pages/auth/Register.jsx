import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  UserPlus,
  ShoppingBag,
  Store,
} from 'lucide-react';

import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(form);

      toast.success('Account created!');

      navigate(
        form.role === 'storeOwner'
          ? '/store-register'
          : '/'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not create your account.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-card border border-border rounded-card shadow-sm p-8">

        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <UserPlus className="w-5 h-5 text-accent" />
        </div>

        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Create your account
        </h1>

        <p className="text-sm text-text-secondary mt-1 mb-6">
          Join Trustore in under a minute.
        </p>

        {/* Account type */}
        <div className="grid grid-cols-2 gap-3 mb-5">

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                role: 'customer',
              })
            }
            className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-sm font-medium transition-colors ${
              form.role === 'customer'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-text-secondary'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Customer
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                role: 'storeOwner',
              })
            }
            className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-sm font-medium transition-colors ${
              form.role === 'storeOwner'
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border text-text-secondary'
            }`}
          >
            <Store className="w-4 h-4" />
            Store owner
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full name */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Full name
            </label>

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Email
            </label>

            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full bg-input border border-border rounded-lg pl-4 pr-11 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="••••••••"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
          >
            Create account
          </Button>

        </form>

        <p className="text-sm text-text-secondary text-center mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-accent font-semibold"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}