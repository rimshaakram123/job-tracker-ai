import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { jobService } from '../services/jobService';
import { aiService } from '../services/aiService';

interface Notification {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  icon: string;
  title: string;
  desc: string;
  link?: string;
}

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    const interval = setInterval(loadNotifications, 5 * 60 * 1000);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const [jobs, resume] = await Promise.all([
        jobService.getAll(),
        aiService.getResume(),
      ]);

      const now = new Date();
      const notices: Notification[] = [];

      // 1. Interviews — wider range now (30 days)
      jobs.forEach((job) => {
        if (!job.interviewDate) return;
        const date = new Date(job.interviewDate);
        const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return; // already past

        if (diffDays === 0) {
          notices.push({
            id: `int-today-${job._id}`,
            type: 'urgent',
            icon: '🔥',
            title: `Interview TODAY at ${job.company}`,
            desc: `${job.position}${job.interviewTime ? ` · ${job.interviewTime}` : ''}`,
            link: '/interviews',
          });
        } else if (diffDays === 1) {
          notices.push({
            id: `int-tom-${job._id}`,
            type: 'urgent',
            icon: '⏰',
            title: `Interview TOMORROW at ${job.company}`,
            desc: `Prep time — review your notes for ${job.position}`,
            link: '/interviews',
          });
        } else if (diffDays <= 7) {
          notices.push({
            id: `int-week-${job._id}`,
            type: 'warning',
            icon: '📅',
            title: `Interview in ${diffDays} days at ${job.company}`,
            desc: job.position,
            link: '/interviews',
          });
        } else if (diffDays <= 30) {
          notices.push({
            id: `int-month-${job._id}`,
            type: 'info',
            icon: '🗓️',
            title: `Upcoming interview at ${job.company}`,
            desc: `In ${diffDays} days · ${job.position}`,
            link: '/interviews',
          });
        }
      });

      // 2. Follow-ups — Applied 14+ days ago
      jobs.forEach((job) => {
        if (job.status !== 'Applied') return;
        const appDate = new Date(job.createdAt);
        const daysSince = Math.floor((now.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysSince >= 14) {
          notices.push({
            id: `follow-${job._id}`,
            type: 'warning',
            icon: '📩',
            title: `Follow up with ${job.company}`,
            desc: `Applied ${daysSince} days ago — send a follow-up email`,
            link: '/applications',
          });
        }
      });

      // 3. Resume missing
      if (!resume) {
        notices.push({
          id: 'no-resume',
          type: 'info',
          icon: '📄',
          title: 'Upload your resume',
          desc: 'Get AI analysis and job matching scores',
          link: '/resume',
        });
      }

      const priority = { urgent: 0, warning: 1, info: 2 };
      notices.sort((a, b) => priority[a.type] - priority[b.type]);

      setNotifications(notices);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const count = notifications.length;
  const hasUrgent = notifications.some((n) => n.type === 'urgent');

  const colorFor = (type: Notification['type']) => {
    if (type === 'urgent') return '#ef4444';
    if (type === 'warning') return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          background: 'transparent',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          width: 38,
          height: 38,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          transition: 'all 0.2s',
        }}
        title="Notifications"
      >
        🔔
        {count > 0 && (
          <span
            className={hasUrgent ? 'animate-pulse-slow' : ''}
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: hasUrgent ? '#ef4444' : '#3b82f6',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 5px',
            }}
          >
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            right: 0,
            width: 340,
            maxHeight: 480,
            overflowY: 'auto',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            zIndex: 200,
          }}
        >
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</p>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
              {count === 0 ? 'All caught up' : `${count} item${count > 1 ? 's' : ''}`}
            </span>
          </div>

          {count === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</p>
              <p style={{ fontSize: '0.9rem' }}>You're all caught up!</p>
            </div>
          ) : (
            <div>
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  to={n.link || '/dashboard'}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.9rem 1rem',
                    borderBottom: '1px solid var(--color-border)',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderLeft: `3px solid ${colorFor(n.type)}`,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          color: colorFor(n.type),
                          marginBottom: '0.2rem',
                        }}
                      >
                        {n.title}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', lineHeight: 1.4 }}>
                        {n.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}