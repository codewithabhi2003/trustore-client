import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Phone,
  Save,
  ShieldCheck,
} from 'lucide-react';

import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data } = await api.put(
        '/users/profile',
        form
      );

      setUser(data.user);

      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Could not update your profile.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent-soft flex items-center justify-center">
            <User className="w-4 h-4 text-accent" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wide text-accent">
            Account
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
          Your profile
        </h1>

        <p className="text-sm text-text-muted mt-1.5">
          Manage your personal information and contact details.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-card shadow-sm overflow-hidden">

        {/* Account overview */}
        <div className="p-5 sm:p-6 border-b border-border">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-accent" />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold text-text-primary truncate">
                {user?.name || 'Your account'}
              </h2>

              <div className="flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />

                <p className="text-xs text-text-muted truncate">
                  {user?.email || 'No email available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-5 sm:p-6"
        >
          <div className="space-y-5">

            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Full name
              </label>

              <div className="relative">
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Enter your full name"
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Email
              </label>

              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-muted outline-none cursor-not-allowed"
                />
              </div>

              <p className="text-[11px] text-text-muted mt-1.5">
                Your email address is used for account authentication and cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-text-primary mb-1.5 block">
                Phone number
              </label>

              <div className="relative">
                <Phone className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />

                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Enter your phone number"
                  className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                />
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2.5 mt-6 p-3.5 rounded-lg bg-surface">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />

            <p className="text-[11px] text-text-muted leading-relaxed">
              Keep your contact information up to date so we can
              provide accurate order and delivery updates.
            </p>
          </div>

          {/* Save */}
          <Button
            type="submit"
            loading={loading}
            className="w-full mt-5"
          >
            <Save className="w-4 h-4" />
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}