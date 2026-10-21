import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@gmail.com', password: 'Admin@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      background: 'linear-gradient(135deg, #0f172a, #111827)',
      color: '#fff',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(148,163,184,0.3)',
        borderRadius: '20px',
        padding: '32px 24px'
      }}>
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>
        <p style={{ color: '#cbd5e1' }}>Use the default admin account</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #334155', background: '#0f172a', color: '#fff' }}
            />
          </div>

          {error && <div style={{ color: '#fca5a5' }}>{error}</div>}

          <button type="submit" disabled={loading} style={{
            padding: '12px 16px',
            border: 'none',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
