import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/analytics')
      .then((res) => setData(res.data))
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Crunching platform numbers..." />;

  const topStores = data?.topStores || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Platform analytics</h1>

      <div className="bg-card border border-border rounded-card shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Top stores by revenue</h3>
        {topStores.length ? (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={topStores}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="storeName" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => formatPrice(v)} />
              <Tooltip
                formatter={(v) => formatPrice(v)}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              />
              <Bar dataKey="revenue" fill="#00C896" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-text-muted">Not enough platform data yet to chart.</p>
        )}
      </div>
    </div>
  );
}
