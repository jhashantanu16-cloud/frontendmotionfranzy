import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import defaultMarketing from '../marketingDefaults';

function MarketingPanel() {
  const [form, setForm] = useState(defaultMarketing);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${API_BASE_URL}/api/settings`).then((res) => {
      const saved = res.data.marketing || {};
      setForm({
        announcement: { ...defaultMarketing.announcement, ...(saved.announcement || {}) },
        offer: { ...defaultMarketing.offer, ...(saved.offer || {}) },
        testimonials: saved.testimonials?.length ? saved.testimonials : defaultMarketing.testimonials,
        tracking: { ...defaultMarketing.tracking, ...(saved.tracking || {}) },
      });
    }).catch(() => {});

    axios.get(`${API_BASE_URL}/api/admin/marketing`, { headers }).then((res) => {
      setStats(res.data);
    }).catch(() => {});
  }, []);

  const updateGroup = (group, field, value) => {
    setForm((current) => ({ ...current, [group]: { ...current[group], [field]: value } }));
  };

  const updateTestimonial = (index, field, value) => {
    setForm((current) => ({
      ...current,
      testimonials: current.testimonials.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }));
  };

  const saveMarketing = async () => {
    try {
      setSaving(true);
      setStatus('');
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/settings`, { marketing: form }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.dispatchEvent(new Event('settings-updated'));
      setStatus('Marketing settings published.');
    } catch (error) {
      setStatus(error.response?.data?.message || 'Could not save marketing settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="marketing-panel">
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-data"><div className="stat-value">{stats?.pageViews ?? '—'}</div><div className="stat-label">Page views, 30 days</div></div></div>
        <div className="stat-card"><div className="stat-data"><div className="stat-value">{stats?.ctaClicks ?? '—'}</div><div className="stat-label">CTA clicks, 30 days</div></div></div>
        <div className="stat-card"><div className="stat-data"><div className="stat-value">{stats?.leads ?? '—'}</div><div className="stat-label">Leads, 30 days</div></div></div>
      </div>

      {(stats?.clicksByLabel || []).length > 0 && (
        <div className="marketing-block">
          <h2>Which buttons people click</h2>
          <ul className="marketing-list">
            {stats.clicksByLabel.map((item) => <li key={item._id || item.label}>{item._id || 'CTA'} <strong>{item.count}</strong></li>)}
          </ul>
        </div>
      )}

      {(stats?.sources || []).length > 0 && (
        <div className="marketing-block">
          <h2>Lead sources</h2>
          <ul className="marketing-list">
            {stats.sources.map((item) => <li key={item._id}>{item._id} <strong>{item.count}</strong></li>)}
          </ul>
        </div>
      )}

      <div className="marketing-block">
        <h2>Announcement bar</h2>
        <label className="marketing-check"><input type="checkbox" checked={form.announcement.enabled} onChange={(e) => updateGroup('announcement', 'enabled', e.target.checked)} /> Show on the website</label>
        <label>Message<input value={form.announcement.text} onChange={(e) => updateGroup('announcement', 'text', e.target.value)} /></label>
        <label>Link label<input value={form.announcement.linkLabel} onChange={(e) => updateGroup('announcement', 'linkLabel', e.target.value)} /></label>
        <label>Link<input value={form.announcement.link} onChange={(e) => updateGroup('announcement', 'link', e.target.value)} placeholder="#contact" /></label>
      </div>

      <div className="marketing-block">
        <h2>Offer</h2>
        <label className="marketing-check"><input type="checkbox" checked={form.offer.enabled} onChange={(e) => updateGroup('offer', 'enabled', e.target.checked)} /> Show above pricing</label>
        <label>Badge<input value={form.offer.badge} onChange={(e) => updateGroup('offer', 'badge', e.target.value)} /></label>
        <label>Title<input value={form.offer.title} onChange={(e) => updateGroup('offer', 'title', e.target.value)} /></label>
        <label>Detail<textarea rows="3" value={form.offer.detail} onChange={(e) => updateGroup('offer', 'detail', e.target.value)} /></label>
      </div>

      <div className="marketing-block">
        <h2>Client proof</h2>
        <p>Replace the sample quotes with real client words before you promote them.</p>
        {form.testimonials.map((item, index) => (
          <div className="marketing-card" key={index}>
            <label>Quote<textarea rows="3" value={item.quote || ''} onChange={(e) => updateTestimonial(index, 'quote', e.target.value)} /></label>
            <label>Name<input value={item.name || ''} onChange={(e) => updateTestimonial(index, 'name', e.target.value)} /></label>
            <label>Role<input value={item.role || ''} onChange={(e) => updateTestimonial(index, 'role', e.target.value)} /></label>
            <label>Result<input value={item.result || ''} onChange={(e) => updateTestimonial(index, 'result', e.target.value)} placeholder="Live in 5 days" /></label>
            <button type="button" className="marketing-remove" onClick={() => setForm((current) => ({ ...current, testimonials: current.testimonials.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn-secondary" onClick={() => setForm((current) => ({ ...current, testimonials: [...current.testimonials, { quote: '', name: '', role: '', result: '' }] }))}>Add testimonial</button>
      </div>

      <div className="marketing-block">
        <h2>Tracking</h2>
        <label>Google Analytics measurement ID<input value={form.tracking.googleAnalyticsId} onChange={(e) => updateGroup('tracking', 'googleAnalyticsId', e.target.value)} placeholder="G-XXXXXXXX" /></label>
        <label>Meta Pixel ID<input value={form.tracking.metaPixelId} onChange={(e) => updateGroup('tracking', 'metaPixelId', e.target.value)} placeholder="1234567890" /></label>
      </div>

      <button type="button" className="btn-primary" disabled={saving} onClick={saveMarketing}>{saving ? 'Publishing…' : 'Publish marketing'}</button>
      {status && <div className="reply-status">{status}</div>}
    </div>
  );
}

export default MarketingPanel;
