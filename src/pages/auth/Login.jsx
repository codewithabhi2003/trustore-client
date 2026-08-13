import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(form.email, form.password);

      toast.success(
        `Welcome back, ${user.name?.split(' ')[0] || 'there'}!`
      );

      navigate(
        location.state?.from?.pathname || '/'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not sign in. Check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-card border border-border rounded-card shadow-sm p-8">

        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <LogIn className="w-5 h-5 text-accent" />
        </div>

        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Welcome back
        </h1>

        <p className="text-sm text-text-secondary mt-1 mb-6">
          Sign in to keep shopping local.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

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
              placeholder="you@example.com"
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
            Sign in
          </Button>
        </form>

        <p className="text-sm text-text-secondary text-center mt-6">
          New to Trustore?{' '}
          <Link
            to="/register"
            className="text-accent font-semibold"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}