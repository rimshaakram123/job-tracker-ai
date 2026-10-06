import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import type { JobAnalytics } from '../types';

const COLORS = {
  Applied: '#3b82f6',
  Interview: '#a855f7',
  Offer: '#22c55e',
  Rejected: '#ef4444',
};

interface Props {
  analytics: JobAnalytics;
}

export default function AnalyticsChart({ analytics }: Props) {
  const barData = [
    { name: 'Applied', value: analytics.Applied },
    { name: 'Interview', value: analytics.Interview },
    { name: 'Offer', value: analytics.Offer },
    { name: 'Rejected', value: analytics.Rejected },
  ];

  const pieData = barData.filter((d) => d.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Application Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: 8,
                color: '#f8fafc',
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {barData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS] || '#3b82f6'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Distribution</h3>
        {pieData.length === 0 ? (
          <div
            style={{
              height: 280,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-muted)',
            }}
          >
            No data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name as keyof typeof COLORS] || '#3b82f6'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#f8fafc',
                }}
              />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}