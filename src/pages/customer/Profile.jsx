import { useState } from 'react';
import toast from 'react-hot-toast';
import { User } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-card border border-border rounded-card shadow-sm p-8">
        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mb-4">
          <User className="w-5 h-5 text-accent" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Your profile</h1>
        <p className="text-sm text-text-secondary mt-1 mb-6">{user?.email}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>
          <Button type="submit" loading={loading} className="w-full">
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
