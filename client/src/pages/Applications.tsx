import { useEffect, useMemo, useState } from 'react';
import { jobService } from '../services/jobService';
import { aiService } from '../services/aiService';
import JobModal from '../components/JobModal';
import type { Job } from '../types';

const statusColors: Record<string, string> = {
  Applied: '#3b82f6',
  Interview: '#a855f7',
  'Technical Interview': '#8b5cf6',
  Offer: '#22c55e',
  Accepted: '#16a34a',
  Rejected: '#ef4444',
  Withdrawn: '#64748b',
};

const ALL_STATUSES = [
  'All',
  'Applied',
  'Interview',
  'Technical Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];

export default function Applications() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [matchError, setMatchError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'company' | 'match'>('newest');

  const load = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAll();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (job: Partial<Job>) => {
    if (editing) await jobService.update(editing._id, job);
    else await jobService.create(job);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    await jobService.delete(id);
    await load();
  };

  const handleMatch = async (job: Job) => {
    setMatchingId(job._id);
    setMatchError('');
    try {
      await aiService.matchJob(job._id);
      await load();
      setExpandedId(job._id);
    } catch (err: any) {
      setMatchError(err.response?.data?.message || 'Match failed');
      setTimeout(() => setMatchError(''), 4000);
    } finally {
      setMatchingId(null);
    }
  };

  const filtered = useMemo(() => {
    let list = [...jobs];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.company.toLowerCase().includes(q) ||
          j.position.toLowerCase().includes(q) ||
          (j.location || '').toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      list = list.filter((j) => j.status === statusFilter);
    }

    if (sort === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'company') {
      list.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sort === 'match') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    return list;
  }, [jobs, search, statusFilter, sort]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Applications</h1>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {filtered.length} of {jobs.length} shown
            </p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="btn-primary"
          >
            + New Application
          </button>
        </div>

        {matchError && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: '#7f1d1d', color: '#fecaca' }}
          >
            {matchError}
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              className="input-field"
              placeholder="Search company, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === 'All' ? 'All statuses' : s}
                </option>
              ))}
            </select>

            <select
              className="input-field"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="newest">Sort: Newest first</option>
              <option value="oldest">Sort: Oldest first</option>
              <option value="company">Sort: Company A–Z</option>
              <option value="match">Sort: Best match first</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="card text-center py-12" style={{ color: 'var(--color-muted)' }}>
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-12">
            <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>
              {jobs.length === 0 ? 'No applications yet.' : 'No matches for your filters.'}
            </p>
            {jobs.length === 0 && (
              <button
                onClick={() => {
                  setEditing(null);
                  setModalOpen(true);
                }}
                className="btn-primary"
              >
                Add your first application
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => {
              const expanded = expandedId === job._id;
              const hasMatch = job.matchScore !== null && job.matchScore !== undefined;
              const matchColor = !hasMatch
                ? '#94a3b8'
                : job.matchScore! >= 70
                ? '#22c55e'
                : job.matchScore! >= 50
                ? '#f59e0b'
                : '#ef4444';

              return (
                <div key={job._id} className="card">
                  {/* Row */}
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.company}</h3>
                        <span
                          style={{
                            background: (statusColors[job.status] || '#64748b') + '22',
                            color: statusColors[job.status] || '#64748b',
                            padding: '0.15rem 0.7rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {job.status}
                        </span>
                        {hasMatch && (
                          <span
                            style={{
                              background: matchColor + '22',
                              color: matchColor,
                              padding: '0.15rem 0.7rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            🎯 {job.matchScore}% match
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        {job.position} {job.location ? `· ${job.location}` : ''}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleMatch(job)}
                        disabled={matchingId === job._id}
                        style={{
                          background: 'rgba(59,130,246,0.15)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59,130,246,0.3)',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '0.4rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {matchingId === job._id ? '⏳ Matching...' : hasMatch ? '🔄 Re-match' : '🎯 Match'}
                      </button>

                      {hasMatch && (
                        <button
                          onClick={() => setExpandedId(expanded ? null : job._id)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-muted)',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '0.4rem',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                          }}
                        >
                          {expanded ? 'Hide details' : 'View details'}
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditing(job);
                          setModalOpen(true);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(job._id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--color-danger)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded match details */}
                  {expanded && hasMatch && (
                    <div
                      style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <p style={{ fontWeight: 600, marginBottom: '0.75rem' }}>
                        🤖 AI Match Analysis
                      </p>

                      {job.matchingSkills && job.matchingSkills.length > 0 && (
                        <div style={{ marginBottom: '0.85rem' }}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                            ✅ MATCHING SKILLS
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.matchingSkills.map((s, i) => (
                              <span
                                key={i}
                                style={{
                                  background: 'rgba(34,197,94,0.15)',
                                  color: '#22c55e',
                                  padding: '0.2rem 0.7rem',
                                  borderRadius: 9999,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <div style={{ marginBottom: '0.85rem' }}>
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginBottom: '0.4rem' }}>
                            ⚠️ SKILLS TO ADD
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills.map((s, i) => (
                              <span
                                key={i}
                                style={{
                                  background: 'rgba(239,68,68,0.15)',
                                  color: '#ef4444',
                                  padding: '0.2rem 0.7rem',
                                  borderRadius: 9999,
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.recommendation && (
                        <p
                          style={{
                            background: 'var(--color-surface-2)',
                            padding: '0.75rem',
                            borderRadius: '0.5rem',
                            fontSize: '0.9rem',
                            color: 'var(--color-muted)',
                            lineHeight: 1.6,
                          }}
                        >
                          💡 {job.recommendation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <JobModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialJob={editing}
      />
    </div>
  );
}