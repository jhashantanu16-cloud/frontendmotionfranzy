import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './ContentManager.css';

const defaultSettings = {
  siteName: 'Motion Franzy',
  siteTitle: 'Motion Franzy — AI Ads Agency',
  siteDescription: 'AI-powered advertising studio for beauty, cosmetics and ecommerce brands.',
  header: {
    navItems: [
      { label: 'Work', href: '#work' },
      { label: 'Services', href: '#services' },
      { label: 'Process', href: '#process' },
      { label: 'Pricing', href: '#pricing' },
    ],
    ctaText: "Let's Talk",
    ctaLink: '#contact',
  },
  heroSection: { enabled: true, title: 'ADS BUILT TO STOP THE SCROLL.', accent: 'STOP THE SCROLL.', subtitle: '', ctaText: 'See the Work', ctaLink: '#work', backgroundOpacity: 1, backgroundSlides: [], badgeText: 'AI-MADE', badgeValue: '100%', badgeSub: 'NO CREW' },
  footer: {
    companyName: 'Motion Franzy',
    description: 'AI ads and creative systems built for modern brands.',
    footerText: '© 2026 Motion Franzy. All rights reserved.',
    socialLinks: { instagram: '#', linkedin: '#', twitter: '#', youtube: '#' },
  },
  brand: {
    primaryColor: '#ED2A22',
    accentColor: '#FFC72C',
    darkColor: '#0A0A0A',
    paperColor: '#F3F1EA',
    logoText: 'MOTION FRANZY',
    logoTag: '/ AI ADS',
  },
  media: {
    showcaseVideos: ['https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview', 'https://drive.google.com/file/d/1b0K5NKnQ_EUiqlnVg0nuG4ZRiVbjZsmg/preview'],
    workVideos: ['https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview', 'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview'],
  },
  seo: {
    metaTitle: 'Motion Franzy — AI Ads Agency',
    metaDescription: 'AI-powered advertising studio for beauty, cosmetics and ecommerce brands.',
    keywords: 'AI ads, growth, branding, creative agency',
  },
  contentBlocks: {
    heroEyebrow: 'AI Advertising Studio', heroSecondaryCta: 'Start a Project', marqueeItems: ['BUILT FOR META ADS', 'INSTAGRAM REELS', 'YOUTUBE SHORTS', 'GOOGLE ADS FORMATS', 'ECOMMERCE BRANDS'],
    introTitle: 'NOT JUST VIDEOS, A GROWTH ENGINE.',
    introSubtitle: 'Every reel is built to earn attention in the first second and convert by the last frame.',
    servicesTitle: 'Smart Creative For Bold Brands.',
    services: [
      { title: 'Scroll-Stop Visuals', description: 'Short-form AI video built for the first 1.5 seconds of a feed.' },
      { title: 'Product Commercials', description: 'Studio-grade hero shots and product films — no physical shoot needed.' },
    ],
    workTitle: 'Real Reels, Real Brands.',
    workVideos: [
      { title: 'Reel 01', video: 'https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview', tag: 'AI Ad' },
      { title: 'Reel 02', video: 'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview', tag: 'AI Ad' },
    ],
    pricingTitle: 'Flexible Plans For Every Brand.',
    pricingPlans: [
      { name: 'Starter', price: '$499', description: '2 AI ad videos', features: ['2 AI ad videos', '1 revision round', 'Meta-ready formats'] },
      { name: 'Growth', price: '$999', description: '5 AI ad videos', popular: true, features: ['5 AI ad videos', 'Ad variant testing', 'Priority turnaround'] },
    ],
    ctaTitle: "Let's Create Ads People Can't Scroll Past.",
    ctaSubtitle: 'Send us your product — we\'ll come back with a free sample scroll-stop visual.',
    ctaPrimary: 'Start a Project',
    ctaSecondary: 'Get a Free Sample',
    processKicker: 'How We Work', processTitle: 'Our Proven Process.', processSteps: [], stats: [],
  },
  contactSection: { enabled: true, title: "Let's Talk.", email: 'shantanujha16@gmail.com', phone: '', address: '', hours: '', formTitle: 'Send us a message' },
  maintenance: { enabled: false, message: 'We are updating the site. Please check back soon.' },
};

function ContentManager({ user }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState('header');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [advancedJson, setAdvancedJson] = useState('');
  const previewFrame = useRef(null);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSettings({
        ...defaultSettings,
        ...response.data,
        header: { ...defaultSettings.header, ...(response.data.header || {}) },
        heroSection: { ...defaultSettings.heroSection, ...(response.data.heroSection || {}) },
        footer: { ...defaultSettings.footer, ...(response.data.footer || {}) },
        brand: { ...defaultSettings.brand, ...(response.data.brand || {}) },
        media: { ...defaultSettings.media, ...(response.data.media || {}) },
        seo: { ...defaultSettings.seo, ...(response.data.seo || {}) },
        contentBlocks: { ...defaultSettings.contentBlocks, ...(response.data.contentBlocks || {}) },
        maintenance: { ...defaultSettings.maintenance, ...(response.data.maintenance || {}) },
        contactSection: { ...defaultSettings.contactSection, ...(response.data.contactSection || {}) },
      });
      setAdvancedJson(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  useEffect(() => {
    if (activeTab !== 'preview') return;
    previewFrame.current?.contentWindow?.postMessage(
      { type: 'cms-preview-update', settings },
      window.location.origin,
    );
  }, [settings, activeTab]);

  const syncPreview = () => {
    previewFrame.current?.contentWindow?.postMessage(
      { type: 'cms-preview-update', settings },
      window.location.origin,
    );
  };

  const updateSection = (section, field, value) => {
    setSettings((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [field]: value } }));
  };

  const handleSaveSettings = async (settingsToSave = settings) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const payloadSource = settingsToSave?.heroSection ? settingsToSave : settings;
      const settingsPayload = { ...payloadSource };
      delete settingsPayload._id;
      delete settingsPayload.__v;
      delete settingsPayload.createdAt;
      delete settingsPayload.updatedAt;
      const response = await axios.put(`${API_BASE_URL}/api/settings`, settingsPayload, { headers: { Authorization: `Bearer ${token}` } });
      setSettings((current) => ({ ...current, ...response.data }));
      localStorage.setItem('settingsUpdated', String(Date.now()));
      window.dispatchEvent(new Event('settings-updated'));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const updateArrayItem = (section, index, key, value) => {
    const [parent, field] = section.split('.');
    const list = [...(field ? settings[parent]?.[field] || [] : settings[section] || [])];
    list[index] = { ...list[index], [key]: value };
    if (field) {
      setSettings((prev) => ({ ...prev, [parent]: { ...(prev[parent] || {}), [field]: list } }));
    } else {
      setSettings((prev) => ({ ...prev, [section]: list }));
    }
  };

  const setContentList = (field, list) => updateSection('contentBlocks', field, list);

  const openAdvancedEditor = () => {
    setAdvancedJson(JSON.stringify(settings, null, 2));
    setActiveTab('advanced');
  };

  const updateAdvancedJson = (value) => {
    setAdvancedJson(value);
    try {
      setSettings(JSON.parse(value));
      setMessage('');
    } catch (error) {
      setMessage('Error: advanced JSON is not valid yet.');
    }
  };

  const updateNestedArray = (section, field, index, value) => {
    const list = [...(settings.contentBlocks?.[field] || [])];
    list[index] = value;
    setSettings((prev) => ({
      ...prev,
      contentBlocks: { ...(prev.contentBlocks || {}), [field]: list },
    }));
  };

  const uploadLogo = async (file) => {
    if (!file) return;
    try {
      setSaving(true);
      const data = new FormData();
      data.append('logo', file);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/settings/logo/upload`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings((current) => ({ ...current, logo: { url: response.data.url } }));
      window.dispatchEvent(new Event('settings-updated'));
      setMessage('Logo updated.');
    } catch (error) {
      setMessage('Error uploading logo: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const uploadHeroVideo = async (file) => {
    if (!file) return;
    try {
      setSaving(true);
      const data = new FormData();
      data.append('video', file);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/media/hero`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = response.data.url;
      setSettings((current) => {
        const slides = current.heroSection?.backgroundSlides || [];
        if (slides.includes(url)) return current;
        return {
          ...current,
          heroSection: { ...current.heroSection, backgroundSlides: [...slides, url] },
        };
      });
      window.dispatchEvent(new Event('settings-updated'));
      setMessage('Background video saved in the database.');
    } catch (error) {
      setMessage('Error uploading video: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const logoPreviewUrl = settings.logo?.url
    ? (String(settings.logo.url).startsWith('http') ? settings.logo.url : `${API_BASE_URL}${settings.logo.url}`)
    : '';
  const heroVideoSlides = (settings.heroSection?.backgroundSlides || []).map((url) => String(url).trim()).filter(Boolean);

  if (loading) return <div className="content-manager-loading">Loading settings...</div>;

  return (
    <div className="content-manager">
      <div className="wrap">
        <div className="content-manager-header">
          <h1 className="display">Website CMS</h1>
          <p>Control the site header, footer, branding, SEO, media, and content blocks.</p>
        </div>

        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

        <div className="content-tabs">
          <button className={`tab-btn ${activeTab === 'header' ? 'active' : ''}`} onClick={() => setActiveTab('header')}>Header</button>
          <button className={`tab-btn ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>Hero</button>
          <button className={`tab-btn ${activeTab === 'process' ? 'active' : ''}`} onClick={() => setActiveTab('process')}>Process</button>
          <button className={`tab-btn ${activeTab === 'pricing' ? 'active' : ''}`} onClick={() => setActiveTab('pricing')}>Pricing</button>
          <button className={`tab-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => setActiveTab('contact')}>Contact</button>
          <button className={`tab-btn ${activeTab === 'footer' ? 'active' : ''}`} onClick={() => setActiveTab('footer')}>Footer</button>
          <button className={`tab-btn ${activeTab === 'seo' ? 'active' : ''}`} onClick={() => setActiveTab('seo')}>SEO</button>
          <button className={`tab-btn ${activeTab === 'branding' ? 'active' : ''}`} onClick={() => setActiveTab('branding')}>Branding</button>
          <button className={`tab-btn ${activeTab === 'media' ? 'active' : ''}`} onClick={() => setActiveTab('media')}>Media</button>
          <button className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>Content blocks</button>
          <button className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`} onClick={() => setActiveTab('preview')}>Live Preview</button>
          <button className={`tab-btn ${activeTab === 'advanced' ? 'active' : ''}`} onClick={openAdvancedEditor}>Advanced</button>
        </div>

        {activeTab === 'preview' ? (
          <section className="website-preview-panel" aria-label="Website live preview">
            <div className="website-preview-toolbar">
              <div>
                <h2>Live website preview</h2>
                <p>Unsaved edits appear here immediately. Save Changes to publish them.</p>
              </div>
              <button type="button" className="btn-secondary" onClick={() => window.open('/', '_blank', 'noopener,noreferrer')}>
                Open full website ↗
              </button>
            </div>
            <iframe
              ref={previewFrame}
              className="website-preview-frame"
              title="Live website preview"
              src={`${window.location.origin}/?cmsPreview=1`}
              onLoad={syncPreview}
            />
          </section>
        ) : <div className="content-panel">
          {activeTab === 'advanced' && (
            <div className="section">
              <h2>Advanced: All Website Settings</h2>
              <p>Edit any stored website field. Changes are applied only when the JSON is valid and you click Save Changes.</p>
              <div className="form-group"><label>Complete settings JSON</label><textarea className="json-editor" rows="28" value={advancedJson} onChange={(e) => updateAdvancedJson(e.target.value)} spellCheck="false" /></div>
            </div>
          )}
          {activeTab === 'hero' && (
            <div className="section">
              <h2>Hero & Announcement Bar</h2>
              {[
                ['heroEyebrow', 'Eyebrow'], ['heroSecondaryCta', 'Secondary Button Text'],
              ].map(([field, label]) => <div className="form-group" key={field}><label>{label}</label><input value={settings.contentBlocks?.[field] || ''} onChange={(e) => updateSection('contentBlocks', field, e.target.value)} /></div>)}
              {[
                ['title', 'Hero Title'], ['accent', 'Accent Text'], ['subtitle', 'Subtitle'], ['ctaText', 'Primary Button Text'], ['ctaLink', 'Primary Button Link'], ['badgeText', 'Badge Text'], ['badgeValue', 'Badge Value'], ['badgeSub', 'Badge Subtext'],
              ].map(([field, label]) => <div className="form-group" key={field}><label>{label}</label>{field === 'subtitle' ? <textarea rows="3" value={settings.heroSection?.[field] || ''} onChange={(e) => updateSection('heroSection', field, e.target.value)} /> : <input value={settings.heroSection?.[field] || ''} onChange={(e) => updateSection('heroSection', field, e.target.value)} />}</div>)}
              <div className="form-group">
                <label htmlFor="hero-background-upload">Background video</label>
                <input id="hero-background-upload" type="file" accept="video/mp4,video/webm" onChange={(e) => uploadHeroVideo(e.target.files?.[0])} />
                <small>The file is saved in MongoDB. The homepage plays every saved video in the background, then repeats.</small>
              </div>
              <div className="form-group">
                <label htmlFor="hero-background-slides">Background videos stored for the homepage</label>
                <textarea id="hero-background-slides" rows="4" value={heroVideoSlides.join('\n')} onChange={(e) => updateSection('heroSection', 'backgroundSlides', e.target.value.split('\n').map((url) => url.trim()).filter(Boolean))} placeholder="/api/media/hero/video.mp4" />
              </div>
              <div className="form-group hero-opacity-setting">
                <label htmlFor="hero-background-opacity">Background opacity: {Math.round(Number(settings.heroSection?.backgroundOpacity ?? 1) * 100)}%</label>
                <input id="hero-background-opacity" type="range" min="0.05" max="1" step="0.05" value={settings.heroSection?.backgroundOpacity ?? 1} onChange={(e) => updateSection('heroSection', 'backgroundOpacity', Number(e.target.value))} />
                <small>Click or drag the slider, then click Save Changes to publish.</small>
              </div>
              <div className="form-group"><label>Marquee Items (one per line)</label><textarea rows="6" value={(settings.contentBlocks?.marqueeItems || []).join('\n')} onChange={(e) => updateSection('contentBlocks', 'marqueeItems', e.target.value.split('\n'))} /></div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="section">
              <h2>Process & Statistics</h2>
              <div className="form-group"><label>Kicker</label><input value={settings.contentBlocks?.processKicker || ''} onChange={(e) => updateSection('contentBlocks', 'processKicker', e.target.value)} /></div>
              <div className="form-group"><label>Title</label><input value={settings.contentBlocks?.processTitle || ''} onChange={(e) => updateSection('contentBlocks', 'processTitle', e.target.value)} /></div>
              <div className="form-group"><label>Steps</label>{(settings.contentBlocks?.processSteps || []).map((step, index) => <div className="feature-item feature-item-three" key={index}><input value={step.number || ''} onChange={(e) => updateArrayItem('contentBlocks.processSteps', index, 'number', e.target.value)} placeholder="01"/><input value={step.title || ''} onChange={(e) => updateArrayItem('contentBlocks.processSteps', index, 'title', e.target.value)} placeholder="Title"/><textarea value={step.description || ''} onChange={(e) => updateArrayItem('contentBlocks.processSteps', index, 'description', e.target.value)} placeholder="Description"/><button type="button" className="remove-btn" onClick={() => setContentList('processSteps', settings.contentBlocks.processSteps.filter((_, i) => i !== index))}>Remove</button></div>)}<button type="button" className="btn-secondary add-btn" onClick={() => setContentList('processSteps', [...(settings.contentBlocks?.processSteps || []), { number: String((settings.contentBlocks?.processSteps?.length || 0) + 1).padStart(2, '0'), title: '', description: '' }])}>Add Step</button></div>
              <div className="form-group"><label>Statistics</label>{(settings.contentBlocks?.stats || []).map((stat, index) => <div className="feature-item" key={index}><input value={stat.value || ''} onChange={(e) => updateArrayItem('contentBlocks.stats', index, 'value', e.target.value)} placeholder="250+"/><input value={stat.label || ''} onChange={(e) => updateArrayItem('contentBlocks.stats', index, 'label', e.target.value)} placeholder="Label"/><button type="button" className="remove-btn" onClick={() => setContentList('stats', settings.contentBlocks.stats.filter((_, i) => i !== index))}>Remove</button></div>)}<button type="button" className="btn-secondary add-btn" onClick={() => setContentList('stats', [...(settings.contentBlocks?.stats || []), { value: '', label: '' }])}>Add Statistic</button></div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="section">
              <h2>Pricing</h2>
              {[['pricingKicker','Kicker'],['pricingTitle','Title'],['pricingButtonText','Button Text'],['pricingSuffix','Price Suffix']].map(([field,label]) => <div className="form-group" key={field}><label>{label}</label><input value={settings.contentBlocks?.[field] || ''} onChange={(e) => updateSection('contentBlocks', field, e.target.value)} /></div>)}
              <div className="form-group"><label>Plans</label>{(settings.contentBlocks?.pricingPlans || []).map((plan,index) => <div className="feature-item feature-card" key={index}><input value={plan.name || ''} onChange={(e) => updateArrayItem('contentBlocks.pricingPlans', index, 'name', e.target.value)} placeholder="Plan name"/><input value={plan.price || ''} onChange={(e) => updateArrayItem('contentBlocks.pricingPlans', index, 'price', e.target.value)} placeholder="$499"/><input value={plan.description || ''} onChange={(e) => updateArrayItem('contentBlocks.pricingPlans', index, 'description', e.target.value)} placeholder="Description"/><textarea rows="4" value={(plan.features || []).join('\n')} onChange={(e) => updateArrayItem('contentBlocks.pricingPlans', index, 'features', e.target.value.split('\n'))} placeholder="One feature per line"/><label className="inline-check"><input type="checkbox" checked={Boolean(plan.popular)} onChange={(e) => updateArrayItem('contentBlocks.pricingPlans', index, 'popular', e.target.checked)}/> Most popular</label><button type="button" className="remove-btn" onClick={() => setContentList('pricingPlans', settings.contentBlocks.pricingPlans.filter((_,i) => i !== index))}>Remove Plan</button></div>)}<button type="button" className="btn-secondary add-btn" onClick={() => setContentList('pricingPlans', [...(settings.contentBlocks?.pricingPlans || []), { name: '', price: '', description: '', popular: false, features: [] }])}>Add Plan</button></div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="section">
              <h2>Contact Section</h2>
              <label className="toggle-group"><input type="checkbox" checked={settings.contactSection?.enabled !== false} onChange={(e) => updateSection('contactSection', 'enabled', e.target.checked)} /> Show contact section</label>
              {[['title','Title'],['email','Recipient Email'],['phone','Phone'],['address','Address'],['formTitle','Form Title']].map(([field,label]) => <div className="form-group" key={field}><label>{label}</label><input value={settings.contactSection?.[field] || ''} onChange={(e) => updateSection('contactSection', field, e.target.value)} /></div>)}
              <div className="form-group"><label>Business Hours</label><textarea rows="4" value={settings.contactSection?.hours || ''} onChange={(e) => updateSection('contactSection', 'hours', e.target.value)} /></div>
            </div>
          )}
          {activeTab === 'header' && (
            <div className="section">
              <h2>Header Settings</h2>
              <div className="form-group">
                <label>Site Name</label>
                <input type="text" value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Header CTA Text</label>
                <input type="text" value={settings.header?.ctaText || ''} onChange={(e) => updateSection('header', 'ctaText', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Header CTA Link</label>
                <input type="text" value={settings.header?.ctaLink || ''} onChange={(e) => updateSection('header', 'ctaLink', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Navigation Items</label>
                {(settings.header?.navItems || []).map((item, index) => (
                  <div className="feature-item" key={index}>
                    <input type="text" value={item.label} onChange={(e) => {
                      const items = [...(settings.header?.navItems || [])];
                      items[index] = { ...items[index], label: e.target.value };
                      updateSection('header', 'navItems', items);
                    }} placeholder="Label" />
                    <input type="text" value={item.href} onChange={(e) => {
                      const items = [...(settings.header?.navItems || [])];
                      items[index] = { ...items[index], href: e.target.value };
                      updateSection('header', 'navItems', items);
                    }} placeholder="#section" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="section">
              <h2>Footer Settings</h2>
              <div className="form-group">
                <label>Company Name</label>
                <input type="text" value={settings.footer?.companyName || ''} onChange={(e) => updateSection('footer', 'companyName', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={settings.footer?.description || ''} onChange={(e) => updateSection('footer', 'description', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Footer Text</label>
                <input type="text" value={settings.footer?.footerText || ''} onChange={(e) => updateSection('footer', 'footerText', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Instagram</label>
                <input type="text" value={settings.footer?.socialLinks?.instagram || ''} onChange={(e) => {
                  const links = { ...(settings.footer?.socialLinks || {}) };
                  links.instagram = e.target.value;
                  updateSection('footer', 'socialLinks', links);
                }} />
              </div>
              <div className="form-group">
                <label>LinkedIn</label>
                <input type="text" value={settings.footer?.socialLinks?.linkedin || ''} onChange={(e) => {
                  const links = { ...(settings.footer?.socialLinks || {}) };
                  links.linkedin = e.target.value;
                  updateSection('footer', 'socialLinks', links);
                }} />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="section">
              <h2>SEO Settings</h2>
              <div className="form-group">
                <label>Meta Title</label>
                <input type="text" value={settings.seo?.metaTitle || ''} onChange={(e) => updateSection('seo', 'metaTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <textarea rows="4" value={settings.seo?.metaDescription || ''} onChange={(e) => updateSection('seo', 'metaDescription', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Keywords</label>
                <input type="text" value={settings.seo?.keywords || ''} onChange={(e) => updateSection('seo', 'keywords', e.target.value)} />
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="section">
              <h2>Branding</h2>
              <div className="form-group logo-upload">
                <label>Logo image</label>
                {logoPreviewUrl ? <div className="logo-preview"><img src={logoPreviewUrl} alt="Current logo" /></div> : <p>No logo image yet. The built-in mark is shown on the site.</p>}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" onChange={(e) => uploadLogo(e.target.files?.[0])} />
                <input type="text" value={settings.logo?.url || ''} placeholder="Or paste an image URL" onChange={(e) => setSettings((current) => ({ ...current, logo: { url: e.target.value } }))} />
                {settings.logo?.url ? <button type="button" className="btn-secondary" onClick={() => setSettings((current) => ({ ...current, logo: { url: '' } }))}>Remove logo image</button> : null}
                <small>Upload applies immediately. A pasted URL is published when you click Save Changes. The image replaces the mark in the header, footer, and browser tab.</small>
              </div>
              <div className="form-group">
                <label>Logo Text</label>
                <input type="text" value={settings.brand?.logoText || ''} onChange={(e) => updateSection('brand', 'logoText', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Logo Tag</label>
                <input type="text" value={settings.brand?.logoTag || ''} onChange={(e) => updateSection('brand', 'logoTag', e.target.value)} />
              </div>
              <div className="colors-grid">
                <div className="form-group">
                  <label>Primary</label>
                  <div className="color-picker">
                    <input type="color" value={settings.brand?.primaryColor || '#ED2A22'} onChange={(e) => updateSection('brand', 'primaryColor', e.target.value)} />
                    <span>{settings.brand?.primaryColor || '#ED2A22'}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Accent</label>
                  <div className="color-picker">
                    <input type="color" value={settings.brand?.accentColor || '#FFC72C'} onChange={(e) => updateSection('brand', 'accentColor', e.target.value)} />
                    <span>{settings.brand?.accentColor || '#FFC72C'}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Dark</label>
                  <div className="color-picker">
                    <input type="color" value={settings.brand?.darkColor || '#0A0A0A'} onChange={(e) => updateSection('brand', 'darkColor', e.target.value)} />
                    <span>{settings.brand?.darkColor || '#0A0A0A'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="section">
              <h2>Media</h2>
              <div className="form-group">
                <label>Showcase Videos</label>
                {(settings.media?.showcaseVideos || []).map((video, index) => (
                  <input key={index} type="text" value={video} onChange={(e) => {
                    const videos = [...(settings.media?.showcaseVideos || [])];
                    videos[index] = e.target.value;
                    updateSection('media', 'showcaseVideos', videos);
                  }} />
                ))}
              </div>
              <div className="form-group">
                <label>Work Videos</label>
                {(settings.contentBlocks?.workVideos || []).map((item, index) => (
                  <div className="feature-item" key={index}>
                    <input type="text" value={item.title || ''} onChange={(e) => {
                      const items = [...(settings.contentBlocks?.workVideos || [])];
                      items[index] = { ...items[index], title: e.target.value };
                      updateSection('contentBlocks', 'workVideos', items);
                    }} placeholder="Reel title" />
                    <input type="text" value={item.video || ''} onChange={(e) => {
                      const items = [...(settings.contentBlocks?.workVideos || [])];
                      items[index] = { ...items[index], video: e.target.value };
                      updateSection('contentBlocks', 'workVideos', items);
                    }} placeholder="Video URL" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="section">
              <h2>Content Blocks</h2>
              <div className="form-group">
                <label>Intro Title</label>
                <input type="text" value={settings.contentBlocks?.introTitle || ''} onChange={(e) => updateSection('contentBlocks', 'introTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Intro Subtitle</label>
                <textarea rows="3" value={settings.contentBlocks?.introSubtitle || ''} onChange={(e) => updateSection('contentBlocks', 'introSubtitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Services Title</label>
                <input type="text" value={settings.contentBlocks?.servicesTitle || ''} onChange={(e) => updateSection('contentBlocks', 'servicesTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Services</label>
                {(settings.contentBlocks?.services || []).map((service, index) => (
                  <div className="feature-item feature-card" key={index}>
                    <input type="text" value={service.title || ''} onChange={(e) => updateArrayItem('contentBlocks.services', index, 'title', e.target.value)} placeholder="Service title" />
                    <textarea rows="2" value={service.description || ''} onChange={(e) => updateArrayItem('contentBlocks.services', index, 'description', e.target.value)} placeholder="Short card description" />
                    <textarea rows="4" value={service.details || ''} onChange={(e) => updateArrayItem('contentBlocks.services', index, 'details', e.target.value)} placeholder="Learn More details" />
                    <textarea rows="4" value={(service.includes || []).join('\n')} onChange={(e) => updateArrayItem('contentBlocks.services', index, 'includes', e.target.value.split('\n'))} placeholder="What's included, one item per line" />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>CTA Title</label>
                <input type="text" value={settings.contentBlocks?.ctaTitle || ''} onChange={(e) => updateSection('contentBlocks', 'ctaTitle', e.target.value)} />
              </div>
              <div className="form-group">
                <label>CTA Subtitle</label>
                <textarea rows="3" value={settings.contentBlocks?.ctaSubtitle || ''} onChange={(e) => updateSection('contentBlocks', 'ctaSubtitle', e.target.value)} />
              </div>
            </div>
          )}
        </div>}

        {activeTab !== 'preview' && <div className="actions">
          <button className="btn-primary" onClick={() => handleSaveSettings()} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button className="btn-secondary" onClick={fetchSettings}>Reset</button>
        </div>}
      </div>
    </div>
  );
}

export default ContentManager;
