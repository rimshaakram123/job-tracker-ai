import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '6rem', fontWeight: 800, margin: 0, color: 'var(--color-primary)' }}>
        404
      </h1>
      <p style={{ color: 'var(--color-muted)', marginBottom: '2rem', fontSize: '1.1rem' }}>
        This page doesn't exist.
      </p>
      <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}