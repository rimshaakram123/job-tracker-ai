import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkStyle = (path: string) => ({
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    color: location.pathname === path ? 'white' : 'var(--color-muted)',
    background: location.pathname === path ? 'var(--color-surface-2)' : 'transparent',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  });

  return (
    <nav
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <Link
          to="/dashboard"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'white',
              fontSize: '0.95rem',
            }}
          >
            C
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>CareerFlow</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
          <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
          <Link to="/applications" style={linkStyle('/applications')}>Applications</Link>
          <Link to="/interviews" style={linkStyle('/interviews')}>Interviews</Link>
          <Link to="/resume" style={linkStyle('/resume')}>Resume</Link>
          <Link to="/assistant" style={linkStyle('/assistant')}>AI Assistant</Link>
          <Link to="/profile" style={linkStyle('/profile')}>Profile</Link>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Notifications />

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: 'white',
            fontSize: '0.85rem',
          }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-muted)',
            padding: '0.4rem 0.9rem',
            borderRadius: '0.4rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'var(--color-border-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-muted)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}