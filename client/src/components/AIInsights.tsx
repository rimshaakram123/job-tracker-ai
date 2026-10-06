import type { JobAnalytics } from '../types';

interface Props {
  analytics: JobAnalytics;
}

interface Insight {
  type: 'success' | 'warning' | 'info';
  title: string;
  desc: string;
}

export default function AIInsights({ analytics }: Props) {
  const insights: Insight[] = [];

  const { total, Interview, Offer, Rejected, Applied } = analytics;

  if (total === 0) {
    insights.push({
      type: 'info',
      title: 'Start tracking your applications',
      desc: 'Add your first job application to unlock personalized career insights.',
    });
  } else {
    const interviewRate = (Interview / total) * 100;
    const offerRate = (Offer / total) * 100;
    const rejectionRate = (Rejected / total) * 100;

    if (interviewRate >= 30) {
      insights.push({
        type: 'success',
        title: 'Strong interview conversion',
        desc: `${interviewRate.toFixed(0)}% of your applications convert to interviews. Keep it up!`,
      });
    } else if (interviewRate > 0) {
      insights.push({
        type: 'warning',
        title: 'Improve your application quality',
        desc: `Only ${interviewRate.toFixed(0)}% convert to interviews. Tailor your resume to each job.`,
      });
    }

    if (offerRate >= 20) {
      insights.push({
        type: 'success',
        title: 'Excellent offer rate',
        desc: `${offerRate.toFixed(0)}% of applications result in offers. You're highly competitive.`,
      });
    } else if (Interview >= 3 && offerRate < 10) {
      insights.push({
        type: 'warning',
        title: 'Interview practice would help',
        desc: `You have ${Interview} interviews but only ${Offer} offers. Practice technical & behavioral rounds.`,
      });
    }

    if (rejectionRate >= 50) {
      insights.push({
        type: 'warning',
        title: 'High rejection rate',
        desc: `${rejectionRate.toFixed(0)}% of applications are rejected. Consider targeting roles better matched to your skills.`,
      });
    }

    if (Applied >= 5 && Interview === 0) {
      insights.push({
        type: 'info',
        title: 'Diversify your approach',
        desc: 'Try reaching out to recruiters directly on LinkedIn for higher response rates.',
      });
    }

    if (total >= 10) {
      insights.push({
        type: 'success',
        title: 'Great application volume',
        desc: `${total} applications shows real persistence. Consistency is key.`,
      });
    }
  }

  const colorMap = {
    success: '#22c55e',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  const iconMap = {
    success: '✅',
    warning: '⚠️',
    info: '💡',
  };

  return (
    <div className="card mt-8">
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: '1.5rem' }}>🤖</span>
        <h3 className="text-lg font-semibold">AI Career Insights</h3>
      </div>

      {insights.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>Not enough data yet.</p>
      ) : (
        <div className="space-y-3">
          {insights.map((ins, i) => (
            <div
              key={i}
              style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                background: 'var(--color-surface-2)',
                borderLeft: `3px solid ${colorMap[ins.type]}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem',
                }}
              >
                <span>{iconMap[ins.type]}</span>
                <strong style={{ color: colorMap[ins.type] }}>{ins.title}</strong>
              </div>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{ins.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}