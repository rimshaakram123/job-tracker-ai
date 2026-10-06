import { useEffect, useRef, useState } from 'react';
import { aiService, type Resume as ResumeType } from '../services/aiService';

export default function Resume() {
  const [resume, setResume] = useState<ResumeType | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await aiService.getResume();
      setResume(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);
    try {
      const data = await aiService.uploadResume(file);
      setResume(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your resume?')) return;
    await aiService.deleteResume();
    setResume(null);
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ color: 'var(--color-muted)' }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📄 Resume Analysis</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Upload your resume and get AI-powered feedback
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-3 rounded-lg text-sm"
            style={{ background: '#7f1d1d', color: '#fecaca' }}
          >
            {error}
          </div>
        )}

        {/* Upload area */}
        {!resume && (
          <div
            className="card text-center"
            style={{
              padding: '4rem 2rem',
              border: '2px dashed var(--color-border)',
              cursor: uploading ? 'wait' : 'pointer',
            }}
            onClick={() => !uploading && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {uploading ? '⏳' : '📤'}
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {uploading ? 'Analyzing your resume...' : 'Upload your resume'}
            </h3>
            <p style={{ color: 'var(--color-muted)' }}>
              PDF or DOCX · Max 5 MB
            </p>
            {uploading && (
              <p
                style={{ color: 'var(--color-primary)', marginTop: '1rem', fontSize: '0.9rem' }}
              >
                AI is reviewing it. This takes 10–30 seconds...
              </p>
            )}
          </div>
        )}

        {/* Analysis results */}
        {resume && (
          <>
            {/* Score card */}
            <div className="card mb-6" style={{ textAlign: 'center' }}>
              <p
                className="text-xs uppercase font-semibold mb-3"
                style={{ color: 'var(--color-muted)' }}
              >
                RESUME SCORE
              </p>
              <div
                style={{
                  fontSize: '4rem',
                  fontWeight: 800,
                  color: scoreColor(resume.aiAnalysis.score),
                }}
              >
                {resume.aiAnalysis.score}
                <span style={{ fontSize: '2rem' }}>/100</span>
              </div>
              <p className="mt-3" style={{ color: 'var(--color-muted)' }}>
                {resume.aiAnalysis.summary}
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
                📎 {resume.fileName} · {Math.round(resume.fileSize / 1024)} KB
              </p>
              <div className="flex gap-3 justify-center mt-6">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="btn-primary"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload New'}
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-danger)',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Delete
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <AnalysisCard
                title="✅ Strengths"
                items={resume.aiAnalysis.strengths}
                color="#22c55e"
              />
              <AnalysisCard
                title="⚠️ Weaknesses"
                items={resume.aiAnalysis.weaknesses}
                color="#ef4444"
              />
            </div>

            {/* Suggestions — full width */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">💡 Suggestions</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                {resume.aiAnalysis.suggestions.map((s, i) => (
                  <li key={i} style={{ marginBottom: '0.75rem', lineHeight: 1.6 }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillsCard
                title="🎯 Skills Found"
                skills={resume.aiAnalysis.skills}
                color="#3b82f6"
              />
              <SkillsCard
                title="📚 Skills to Add"
                skills={resume.aiAnalysis.missingSkills}
                color="#f59e0b"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AnalysisCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4" style={{ color }}>
        {title}
      </h3>
      {items.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>None detected.</p>
      ) : (
        <ul style={{ paddingLeft: '1.25rem' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.5rem', lineHeight: 1.5 }}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SkillsCard({
  title,
  skills,
  color,
}: {
  title: string;
  skills: string[];
  color: string;
}) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4" style={{ color }}>
        {title}
      </h3>
      {skills.length === 0 ? (
        <p style={{ color: 'var(--color-muted)' }}>None detected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <span
              key={i}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: color + '22',
                color,
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}