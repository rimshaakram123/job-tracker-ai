import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    { icon: '📋', title: 'Application Tracking', desc: 'Manage every job in one place with status, notes, and interview dates.' },
    { icon: '📊', title: 'Career Analytics', desc: 'See your success rate, interview conversions, and offers at a glance.' },
    { icon: '🤖', title: 'AI Career Assistant', desc: 'Get personalized advice based on YOUR resume and job search data.' },
    { icon: '📄', title: 'Resume Analysis', desc: 'AI scores your resume, spots gaps, and suggests targeted improvements.' },
    { icon: '🎯', title: 'Interview Prep', desc: 'Track interviews, prepare checklists, and never miss a follow-up.' },
    { icon: '💡', title: 'Skill Insights', desc: 'Discover which skills to learn next based on the jobs you apply to.' },
  ];

  const steps = [
    { num: '1', title: 'Create your account', desc: 'Sign up in 30 seconds. No credit card needed.' },
    { num: '2', title: 'Upload your resume', desc: 'Get instant AI analysis with a score and personalized suggestions.' },
    { num: '3', title: 'Track applications', desc: 'Log every job. Watch your progress in real time.' },
    { num: '4', title: 'Land the job', desc: 'Use AI insights to improve strategy and convert more interviews.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', overflowX: 'hidden' }}>
      {/* Top nav */}
      <nav
        style={{
          padding: '1.25rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          background: 'rgba(2, 6, 23, 0.9)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: 'white',
              fontSize: '1.1rem',
            }}
          >
            C
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>CareerFlow</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 1rem' }}>
            Login
          </Link>
          <Link to="/register" className="btn-primary btn-glow">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '7rem 2rem 5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="animate-fade-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            ✨ Powered by Advanced AI
          </div>

          <h1
            className="animate-fade-up"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: '1.5rem',
              color: 'white',
              animationDelay: '0.1s',
            }}
          >
            Your personal
            <br />
            <span className="gradient-text">AI career operating system</span>
          </h1>

          <p
            className="animate-fade-up"
            style={{
              fontSize: '1.2rem',
              color: 'var(--color-muted)',
              maxWidth: 640,
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
              animationDelay: '0.2s',
            }}
          >
            Track applications, analyze your job search, prep for interviews, and
            get AI-powered career advice — all in one beautiful dashboard.
          </p>

          <div
            className="animate-fade-up"
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}
          >
            <Link
              to="/register"
              className="btn-primary btn-glow"
              style={{ padding: '0.9rem 2rem', fontSize: '1rem', textDecoration: 'none' }}
            >
              Start Tracking Free →
            </Link>
            <Link to="/login" className="btn-ghost" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              Sign In
            </Link>
          </div>

          <p
            className="animate-fade-up"
            style={{
              marginTop: '2rem',
              fontSize: '0.85rem',
              color: 'var(--color-muted)',
              animationDelay: '0.4s',
            }}
          >
            ⚡ No credit card · 🤖 AI-powered · 🔒 Secure
          </p>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            FEATURES
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Everything you need to land the job
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
            Built for students, graduates, and professionals who take their job search seriously.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {features.map((f) => (
            <div key={f.title} className="card card-hover">
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>
                {f.title}
              </h3>
              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#60a5fa', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            HOW IT WORKS
          </p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white' }}>
            Land your dream job in 4 steps
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {steps.map((s, i) => (
            <div key={s.num} className="card" style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: -16,
                  left: 24,
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1rem',
                }}
              >
                {s.num}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: 'white' }}>
                  {s.title}
                </h3>
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
            border: '1px solid rgba(59,130,246,0.3)',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Ready to take control of your career?
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Join thousands of job seekers using CareerFlow to land better jobs faster.
          </p>
          <Link
            to="/register"
            className="btn-primary btn-glow"
            style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', textDecoration: 'none' }}
          >
            Get Started — It's Free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-muted)',
          fontSize: '0.9rem',
        }}
      >
        © 2026 CareerFlow — Built with ❤️ for job seekers
      </div>
    </div>
  );
}