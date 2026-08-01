import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Loader from '../../components/common/Loader';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatPrice';

export default function SalesAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/store-orders')
      .then((res) => {
        const orders = res.data.orders || res.data || [];
        const byDay = {};
        orders.forEach((o) => {
          const day = new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
          byDay[day] = (byDay[day] || 0) + o.totalAmount;
        });
        setData(Object.entries(byDay).map(([day, revenue]) => ({ day, revenue })));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader fullScreen label="Crunching your sales..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">Sales analytics</h1>

      <div className="bg-card border border-border rounded-card shadow-sm p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Revenue over time</h3>
        {data?.length ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={(v) => formatPrice(v)} />
              <Tooltip
                formatter={(v) => formatPrice(v)}
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#00C896" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-text-muted">Not enough order history yet to chart.</p>
        )}
      </div>
    </div>
  );
}
