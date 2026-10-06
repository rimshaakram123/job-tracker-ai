import { useEffect, useState } from 'react';
import { jobService } from '../services/jobService';
import type { Job } from '../types';

export default function Interviews() {
  const [upcoming, setUpcoming] = useState<Job[]>([]);
  const [past, setPast] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService
      .getInterviews()
      .then((data) => {
        setUpcoming(data.upcoming);
        setPast(data.past);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const daysUntil = (dateStr?: string) => {
    if (!dateStr) return null;
    const diff = new Date(dateStr).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const typeIcon = (type?: string) => {
    switch (type) {
      case 'Phone Screen': return '📞';
      case 'Technical': return '💻';
      case 'Behavioral': return '🧠';
      case 'HR': return '👔';
      case 'Final Round': return '🏁';
      default: return '💼';
    }
  };

  const InterviewCard = ({ job, isPast }: { job: Job; isPast: boolean }) => {
    const days = daysUntil(job.interviewDate);
    const urgent = !isPast && days !== null && days <= 2;

    return (
      <div
        className="card"
        style={{
          borderLeft: `4px solid ${isPast ? '#64748b' : urgent ? '#ef4444' : '#3b82f6'}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.company}</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.15rem' }}>
              {job.position}
            </p>
          </div>
          <span style={{ fontSize: '1.5rem' }}>{typeIcon(job.interviewType)}</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', fontSize: '0.9rem' }}>
          <span>
            📅 {job.interviewDate ? new Date(job.interviewDate).toLocaleDateString(undefined, {
              weekday: 'short', month: 'short', day: 'numeric'
            }) : '—'}
          </span>
          {job.interviewTime && <span>🕐 {job.interviewTime}</span>}
          {job.interviewType && (
            <span
              style={{
                background: 'var(--color-surface-2)',
                padding: '0.15rem 0.6rem',
                borderRadius: 9999,
                fontSize: '0.8rem',
              }}
            >
              {job.interviewType}
            </span>
          )}
        </div>

        {!isPast && days !== null && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: urgent ? '#ef4444' : '#3b82f6',
            }}
          >
            {days === 0 ? '🔥 Today!' : days === 1 ? '⏰ Tomorrow' : `⏳ In ${days} days`}
          </p>
        )}

        {job.interviewNotes && (
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.9rem',
              color: 'var(--color-muted)',
              borderTop: '1px solid var(--color-border)',
              paddingTop: '0.75rem',
            }}
          >
            📝 {job.interviewNotes}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>🎯 Interviews</h1>
          <p style={{ color: 'var(--color-muted)', marginTop: '0.25rem' }}>
            Prepare, track, and never miss an interview
          </p>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-muted)' }}>
            Loading...
          </div>
        ) : (
          <>
            {/* Upcoming */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⏳ Upcoming ({upcoming.length})
              </h2>
              {upcoming.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</p>
                  <p style={{ color: 'var(--color-muted)' }}>
                    No upcoming interviews. Add interview details from the Applications page.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {upcoming.map((job) => (
                    <InterviewCard key={job._id} job={job} isPast={false} />
                  ))}
                </div>
              )}
            </div>

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  📚 Past ({past.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ opacity: 0.85 }}>
                  {past.map((job) => (
                    <InterviewCard key={job._id} job={job} isPast={true} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}