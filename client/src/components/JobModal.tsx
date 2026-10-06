import { useState, useEffect } from 'react';
import type { Job, JobStatus } from '../types';

const STATUSES: JobStatus[] = [
  'Applied',
  'Interview',
  'Technical Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];

const INTERVIEW_TYPES = ['', 'Phone Screen', 'Technical', 'Behavioral', 'HR', 'Final Round', 'Other'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Partial<Job>) => Promise<void>;
  initialJob?: Job | null;
}

export default function JobModal({ isOpen, onClose, onSave, initialJob }: Props) {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<JobStatus>('Applied');
  const [applicationDate, setApplicationDate] = useState('');
  const [notes, setNotes] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showInterview, setShowInterview] = useState(false);

  useEffect(() => {
    if (initialJob) {
      setCompany(initialJob.company || '');
      setPosition(initialJob.position || '');
      setLocation(initialJob.location || '');
      setSalary(initialJob.salary || '');
      setStatus(initialJob.status || 'Applied');
      setApplicationDate(
        initialJob.applicationDate
          ? initialJob.applicationDate.slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setNotes(initialJob.notes || '');
      setInterviewDate(
        initialJob.interviewDate ? initialJob.interviewDate.slice(0, 10) : ''
      );
      setInterviewTime(initialJob.interviewTime || '');
      setInterviewType(initialJob.interviewType || '');
      setInterviewNotes(initialJob.interviewNotes || '');
      setShowInterview(!!initialJob.interviewDate);
    } else {
      setCompany('');
      setPosition('');
      setLocation('');
      setSalary('');
      setStatus('Applied');
      setApplicationDate(new Date().toISOString().slice(0, 10));
      setNotes('');
      setInterviewDate('');
      setInterviewTime('');
      setInterviewType('');
      setInterviewNotes('');
      setShowInterview(false);
    }
  }, [initialJob, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        company,
        position,
        location,
        salary,
        status,
        applicationDate,
        notes,
        interviewDate: interviewDate || undefined,
        interviewTime,
        interviewType,
        interviewNotes,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">
          {initialJob ? 'Edit Application' : 'New Application'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <input
                className="input-field"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position *</label>
              <input
                className="input-field"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                className="input-field"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Salary</label>
              <input
                className="input-field"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="input-field"
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Application Date</label>
              <input
                type="date"
                className="input-field"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="input-field"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Interview section toggle */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={() => setShowInterview(!showInterview)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.95rem',
              }}
            >
              {showInterview ? '− Hide interview details' : '+ Add interview details'}
            </button>
          </div>

          {showInterview && (
            <div className="space-y-4" style={{ paddingLeft: '0.5rem' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Interview Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input
                    type="time"
                    className="input-field"
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Type</label>
                <select
                  className="input-field"
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  {INTERVIEW_TYPES.map((t) => (
                    <option key={t} value={t}>{t || 'Select type...'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Notes</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Topics to prepare, interviewer name, etc."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : initialJob ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}