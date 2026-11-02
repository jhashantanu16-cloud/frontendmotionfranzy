import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BRAND_LOGO } from '../components/BrandLoader';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.setAttribute('name', 'robots');
      document.head.appendChild(robots);
    }
    const previous = robots.getAttribute('content');
    robots.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (previous) robots.setAttribute('content', previous);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await onLogin(form.email, form.password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: '#0a0a0a',
      color: '#fff',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: '#111111',
        border: '1px solid rgba(251,250,247,0.12)',
        borderRadius: '20px',
        padding: '32px 24px'
      }}>
        <img src={BRAND_LOGO} alt="Motion Franzy" style={{ width: 280, height: 'auto', margin: '0 auto 18px', display: 'block' }} />
        <p style={{ color: '#cbd5e1' }}>Sign in with the admin account stored in the database.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="username"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              autoComplete="current-password"
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          {error && <div style={{ color: '#fca5a5' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            padding: '12px 16px',
            border: 'none',
            borderRadius: '12px',
            background: '#ED2A22',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
