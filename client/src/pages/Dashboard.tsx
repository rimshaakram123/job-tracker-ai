import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import AnalyticsChart from '../components/AnalyticsChart';
import AIInsights from '../components/AIInsights';
import type { JobAnalytics, Job } from '../types';
import type { Resume } from '../services/aiService';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<JobAnalytics | null>(null);
  const [recent, setRecent] = useState<Job[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    jobService.getAnalytics().then(setAnalytics).catch(console.error);
    jobService.getAll().then((jobs) => setRecent(jobs.slice(0, 5))).catch(console.error);
    aiService.getResume().then(setResume).catch(console.error);
  }, []);

  const successRate =
    analytics && analytics.total > 0
      ? ((analytics.Offer / analytics.total) * 100).toFixed(1)
      : '0.0';

  const resumeScore = resume?.aiAnalysis?.score ?? 0;

  // Career readiness: weighted mix of resume + application activity
  const careerScore = Math.min(
    100,
    Math.round(resumeScore * 0.5 + Math.min(analytics?.total ?? 0, 20) * 2.5)
  );

  const careerScoreColor =
    careerScore >= 75 ? '#22c55e' : careerScore >= 50 ? '#f59e0b' : '#ef4444';

  const cards = [
    { label: 'Total Applications', value: analytics?.total ?? 0, color: '#3b82f6', icon: '📋' },
    { label: 'Interviews', value: analytics?.Interview ?? 0, color: '#a855f7', icon: '💼' },
    { label: 'Offers', value: analytics?.Offer ?? 0, color: '#22c55e', icon: '🎉' },
    { label: 'Rejected', value: analytics?.Rejected ?? 0, color: '#ef4444', icon: '❌' },
  ];

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem' }}>
            Here's your career snapshot for today
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {cards.map((c) => (
            <div key={c.label} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    color: 'var(--color-muted)',
                  }}
                >
                  {c.label}
                </p>
                <span style={{ fontSize: '1.25rem' }}>{c.icon}</span>
              </div>
              <p
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: c.color,
                  marginTop: '0.75rem',
                  lineHeight: 1,
                }}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>

        {/* Career Score + Success Rate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Career Readiness */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-muted)' }}>
                  Career Readiness Score
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Based on resume + activity
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: careerScoreColor, lineHeight: 1 }}>
                  {careerScore}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>/ 100</p>
              </div>
            </div>
            <div
              style={{
                width: '100%',
                height: 10,
                background: 'var(--color-surface-2)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${careerScore}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${careerScoreColor}, ${careerScoreColor}cc)`,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>

          {/* Success rate */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-muted)' }}>
                  Success Rate
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Offers / Total applications
                </p>
              </div>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>
                {successRate}%
              </p>
            </div>
            <div
              style={{
                width: '100%',
                height: 10,
                background: 'var(--color-surface-2)',
                borderRadius: 9999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${successRate}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Resume widget */}
        {resume ? (
          <Link
            to="/resume"
            className="card card-hover mb-6"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-muted)' }}>
                  Resume Score
                </p>
                <p style={{ fontSize: '1rem', marginTop: '0.4rem', color: 'white', fontWeight: 600 }}>
                  📄 {resume.fileName}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                  Click to view detailed AI analysis →
                </p>
              </div>
              <p
                style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: resumeScore >= 75 ? '#22c55e' : resumeScore >= 50 ? '#f59e0b' : '#ef4444',
                  lineHeight: 1,
                }}
              >
                {resumeScore}
              </p>
            </div>
          </Link>
        ) : (
          <Link
            to="/resume"
            className="card card-hover mb-6"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              border: '1px dashed var(--color-border-hover)',
            }}
          >
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</p>
              <p style={{ fontWeight: 600, color: 'white' }}>Upload your resume</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                Get your AI score + improvement tips
              </p>
            </div>
          </Link>
        )}

        {/* Charts */}
        {analytics && <AnalyticsChart analytics={analytics} />}

        {/* AI Insights */}
        {analytics && <AIInsights analytics={analytics} />}

        {/* Recent applications */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Applications</h3>
            {recent.length > 0 && (
              <Link to="/applications" style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
                View all →
              </Link>
            )}
          </div>

          {recent.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>
                No applications yet — start tracking your job search.
              </p>
              <Link to="/applications" className="btn-primary" style={{ textDecoration: 'none' }}>
                Add First Application
              </Link>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {recent.map((job) => (
                    <tr key={job._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{job.company}</td>
                      <td style={{ padding: '1rem', color: 'var(--color-muted)' }}>{job.position}</td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <span
                          style={{
                            background: 'var(--color-surface-2)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: 9999,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}