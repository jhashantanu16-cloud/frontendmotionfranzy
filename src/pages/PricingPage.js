import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PricingPagePolish.css';

const defaultSettings = {
  siteName: 'Motion Franzy',
  header: { navItems: [{ label: 'Work', href: '#work' }, { label: 'Services', href: '#services' }, { label: 'Process', href: '#process' }, { label: 'Pricing', href: '#pricing' }], ctaText: 'Get Started', ctaLink: '#contact' },
  heroSection: { title: 'AI VIDEO ADS THAT CONVERT.', accent: 'THAT CONVERT.', subtitle: 'Create scroll-stopping video ads in minutes. Powered by AI, optimized for profit. Perfect for cosmetics, beauty, and ecommerce brands ready to scale.', ctaText: 'View Portfolio', ctaLink: '#work', backgroundOpacity: 1, backgroundSlides: ['https://www.w3schools.com/html/mov_bbb.mp4', 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'] },
  brand: { primaryColor: '#ED2A22', accentColor: '#FFC72C', darkColor: '#0A0A0A', paperColor: '#F3F1EA', logoText: 'MOTION FRANZY', logoTag: '/ AI ADS' },
  contentBlocks: {
    heroEyebrow: 'AI Advertising Studio', heroSecondaryCta: 'Start a Project',
    marqueeItems: ['BUILT FOR META ADS', 'INSTAGRAM REELS', 'YOUTUBE SHORTS', 'GOOGLE ADS FORMATS', 'ECOMMERCE BRANDS'],
    introTitle: 'AI-POWERED VIDEO ADVERTISING.',
    introSubtitle: 'High-converting video ads made fast. No crew, no studio, no compromise on quality. Just results.',
    servicesTitle: 'Everything You Need To Win.',
    servicesKicker: 'What We Do', servicesDescription: "We combine AI production with ad strategy to build creative that's engineered to perform, not just look good.", serviceLinkText: 'Learn More', introLinkText: 'View Full Portfolio',
    services: [
      { title: 'AI Video Generation', description: 'Professional video ads generated in minutes. From product shots to full campaigns, all AI-powered.' },
      { title: 'Scroll-Stop Hooks', description: 'The first 1.5 seconds are everything. We create thumb-stopping openings that convert.' },
      { title: 'Multi-Format Delivery', description: 'Instagram Reels, Meta Ads, YouTube Shorts, Google Ads. One brief, unlimited formats.' },
      { title: 'Conversion Optimized', description: 'Every frame is built to convert. Tested hooks, proven CTAs, measurable ROI.' }
    ],
    workTitle: 'Real Reels, Real Brands.',
    workKicker: 'Selected Work',
    workVideos: [
      { title: 'Reel 01', video: 'https://drive.google.com/file/d/1t8Pa7sulJI0naaUZri_DgQSkKoqelGdN/preview', tag: 'AI Ad' },
      { title: 'Reel 02', video: 'https://drive.google.com/file/d/1gHorDzFkLBJo7OHGEcaWMzCvh_Jff2X3/preview', tag: 'AI Ad' },
      { title: 'Reel 03', video: 'https://drive.google.com/file/d/1b0K5NKnQ_EUiqlnVg0nuG4ZRiVbjZsmg/preview', tag: 'AI Ad' },
      { title: 'Reel 04', video: 'https://drive.google.com/file/d/1gRIuNYKVTv5Yn9bAbLsHkSrwWUrgzHIH/preview', tag: 'AI Ad' },
      { title: 'Reel 05', video: 'https://drive.google.com/file/d/1ierWyORY9wELq6CxmZjLKcf1bpJNssq0/preview', tag: 'AI Ad' }
    ],
    pricingTitle: 'Flexible Plans For Every Brand.',
    pricingKicker: 'Pricing', pricingButtonText: 'Choose Plan', pricingSuffix: '/mo',
    pricingPlans: [
      { name: 'Launch', price: '$499', description: '2 AI video ads + session', features: ['2 custom AI video ads', '1 revision round', 'All format exports', 'Strategy session'] },
      { name: 'Growth', price: '$1,299', description: 'Unlimited ads monthly', popular: true, features: ['Unlimited AI video ads', 'A/B testing variants', 'Priority turnaround', 'Monthly strategy calls'] },
      { name: 'Scale', price: '$3,499', description: 'Full campaign management', features: ['Unlimited everything', 'Dedicated director', 'Weekly optimization', 'Direct support'] }
    ],
    ctaTitle: 'Ready To Dominate Your Feed?',
    ctaSubtitle: 'Book a free strategy call and get your first sample video in 24 hours.',
    processKicker: 'How We Work', processTitle: 'Our Proven Process.',
    processSteps: [
      { number: '01', title: 'Discovery', description: 'Product, audience and current ad performance.' },
      { number: '02', title: 'Concept', description: '2–3 creative directions, storyboarded first.' },
      { number: '03', title: 'Production', description: 'AI-generated visuals, built fast, refined on feedback.' },
      { number: '04', title: 'Launch', description: 'Delivered ad-ready, with variants for testing.' },
    ],
    stats: [{ value: '250+', label: 'Ads Produced' }, { value: '30+', label: 'Brands Served' }, { value: '3x', label: 'Faster Turnaround' }, { value: '98%', label: 'Client Satisfaction' }],
  },
  footer: { companyName: 'Motion Franzy', description: 'AI ads and creative systems built for modern brands.', footerText: '© 2026 Motion Franzy. All rights reserved.', socialLinks: { instagram: '#', linkedin: '#', twitter: '#', youtube: '#' } },
  contactSection: { enabled: true, title: "Let's Talk.", email: 'shantanujha16@gmail.com', phone: '+1 (555) 123-4567', address: 'San Francisco, CA', hours: 'Monday – Friday: 9am – 6pm PT\nSaturday – Sunday: By appointment', formTitle: 'Send us a message' },
  seo: { metaTitle: 'Motion Franzy — AI Ads Agency', metaDescription: 'AI-powered advertising studio for beauty, cosmetics and ecommerce brands.' },
};

function PricingPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const heroSlideTimer = useRef(null);

  useEffect(() => {
    const isCmsPreview = new URLSearchParams(window.location.search).has('cmsPreview');
    if (isCmsPreview) {
      const receivePreviewSettings = (event) => {
        if (event.origin !== window.location.origin || event.data?.type !== 'cms-preview-update') return;
        if (event.data.settings && typeof event.data.settings === 'object') {
          setSettings((current) => ({ ...current, ...event.data.settings }));
        }
      };
      window.addEventListener('message', receivePreviewSettings);
      return () => window.removeEventListener('message', receivePreviewSettings);
    }

    const fetchSettings = () => axios.get('http://localhost:5000/api/settings').then((res) => {
      setSettings({
        ...defaultSettings,
        ...res.data,
        header: { ...defaultSettings.header, ...(res.data.header || {}) },
        heroSection: { ...defaultSettings.heroSection, ...(res.data.heroSection || {}) },
        brand: { ...defaultSettings.brand, ...(res.data.brand || {}) },
        contentBlocks: { ...defaultSettings.contentBlocks, ...(res.data.contentBlocks || {}) },
        footer: { ...defaultSettings.footer, ...(res.data.footer || {}) },
        contactSection: { ...defaultSettings.contactSection, ...(res.data.contactSection || {}) },
        seo: { ...defaultSettings.seo, ...(res.data.seo || {}) },
      });
    }).catch(() => {});

    fetchSettings();
    const handleSettingsUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleSettingsUpdate);
    window.addEventListener('storage', handleSettingsUpdate);
    window.addEventListener('focus', handleSettingsUpdate);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
      window.removeEventListener('storage', handleSettingsUpdate);
      window.removeEventListener('focus', handleSettingsUpdate);
    };
  }, []);

  const theme = { red: settings.brand?.primaryColor || '#ED2A22', yellow: settings.brand?.accentColor || '#FFC72C', black: settings.brand?.darkColor || '#0A0A0A', paper: settings.brand?.paperColor || '#F3F1EA', white: '#FBFAF7' };
  const header = settings.header || defaultSettings.header;
  const hero = settings.heroSection || defaultSettings.heroSection;
  const blocks = settings.contentBlocks || defaultSettings.contentBlocks;
  const footer = settings.footer || defaultSettings.footer;
  const contact = settings.contactSection || defaultSettings.contactSection;
  const navItems = header.navItems || defaultSettings.header.navItems;
  const services = blocks.services || defaultSettings.contentBlocks.services;
  const workVideos = blocks.workVideos || defaultSettings.contentBlocks.workVideos;
  const pricingPlans = blocks.pricingPlans || defaultSettings.contentBlocks.pricingPlans;
  const heroTitle = hero.title || '';
  const heroAccent = hero.accent || '';
  const heroAccentIndex = heroAccent ? heroTitle.toLowerCase().lastIndexOf(heroAccent.toLowerCase()) : -1;
  const heroTitleLead = heroAccentIndex >= 0 ? heroTitle.slice(0, heroAccentIndex).trim() : heroTitle;
  const configuredHeroSlides = (hero.backgroundSlides || []).filter(Boolean);
  const legacyImageSlidesOnly = configuredHeroSlides.length > 0 && configuredHeroSlides.every((url) => /\.(avif|gif|jpe?g|png|svg|webp)(\?.*)?$/i.test(url) || /images\.unsplash\.com/i.test(url));
  const heroBackgroundSlides = configuredHeroSlides.length && !legacyImageSlidesOnly ? configuredHeroSlides : defaultSettings.heroSection.backgroundSlides;
  const heroBackgroundKey = heroBackgroundSlides.join('\n');

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [heroBackgroundKey]);

  useEffect(() => {
    if (heroBackgroundSlides.length < 2) return undefined;
    heroSlideTimer.current = window.setTimeout(() => {
      setHeroSlideIndex((current) => (current + 1) % heroBackgroundSlides.length);
    }, 30000);
    return () => window.clearTimeout(heroSlideTimer.current);
  }, [heroBackgroundKey, heroSlideIndex]);

  const getHeroVideoSource = (videoUrl = '') => {
    const driveFileId = videoUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([^/?]+)/i)?.[1];
    if (driveFileId) {
      return { type: 'file', url: `https://drive.google.com/uc?export=download&id=${driveFileId}` };
    }
    return { type: 'file', url: videoUrl };
  };

  const advanceHeroVideo = () => {
    window.clearTimeout(heroSlideTimer.current);
    setHeroSlideIndex((current) => (current + 1) % heroBackgroundSlides.length);
  };

  const scheduleHeroVideoEnd = (duration) => {
    if (!Number.isFinite(duration) || duration <= 0 || heroBackgroundSlides.length < 2) return;
    window.clearTimeout(heroSlideTimer.current);
    heroSlideTimer.current = window.setTimeout(advanceHeroVideo, duration * 1000);
  };

  const skipFailedHeroVideo = () => {
    window.clearTimeout(heroSlideTimer.current);
    heroSlideTimer.current = window.setTimeout(advanceHeroVideo, 4000);
  };

  const currentHeroVideo = getHeroVideoSource(heroBackgroundSlides[heroSlideIndex % heroBackgroundSlides.length]);
  const heroVideoStyle = {
    opacity: Math.min(1, Math.max(0, Number(hero.backgroundOpacity ?? 1))),
    '--hero-video-opacity': Math.min(1, Math.max(0, Number(hero.backgroundOpacity ?? 1))),
  };

  const handleNavigate = (target) => {
    if (!target) return;

    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (target.startsWith('#')) {
      const element = document.getElementById(target.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = target;
      }
      return;
    }

    if (target === '/login' || target === '/admin') {
      window.location.href = target;
      return;
    }

    window.location.href = target;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus('Please fill in all fields');
      return;
    }
    try {
      setSubmitting(true);
      setFormStatus('');
      await axios.post('http://localhost:5000/api/contact', {
        ...contactForm,
        plan: selectedPlan?.name || '',
        price: selectedPlan?.price || '',
      });
      setContactForm({ name: '', email: '', message: '' });
      setSelectedPlan(null);
      setFormStatus('Message sent successfully!');
    } catch (error) {
      setFormStatus('Error sending message: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleChoosePlan = (plan) => {
    setSelectedPlan(plan);
    setContactForm((current) => ({
      ...current,
      message: `I'm interested in the ${plan.name} plan (${plan.price}${blocks.pricingSuffix || ''}). Please share the next steps.`,
    }));

    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  return (
    <>
      <style>{`
        :root { --red: ${theme.red}; --yellow: ${theme.yellow}; --black: ${theme.black}; --paper: ${theme.paper}; --white: ${theme.white}; }
        *{margin:0;padding:0;box-sizing:border-box;} html{scroll-behavior:smooth;} body{background:var(--black);color:var(--white);font-family:'Inter',sans-serif;overflow-x:hidden;} a{color:inherit;text-decoration:none;} img,iframe{max-width:100%;display:block;} .display{font-family:'Archivo Black',sans-serif;text-transform:uppercase;letter-spacing:-0.01em;} .script{font-family:'Caveat',cursive;} .wrap{max-width:1200px;margin:0 auto;padding:0 32px;} @media(max-width:640px){.wrap{padding:0 20px;}}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,10,0.78);backdrop-filter:blur(10px);border-bottom:1px solid rgba(251,250,247,0.12);} .nav-inner{max-width:1200px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;} .brand{display:flex;align-items:center;gap:10px;} .brand-mark{width:34px;height:34px;flex-shrink:0;} .brand-word{font-family:'Archivo Black',sans-serif;font-size:14px;letter-spacing:0.02em;} .brand-word span{color:var(--yellow);} .nav-links{display:flex;gap:34px;font-size:13.5px;font-weight:600;} .nav-links a{opacity:0.72;transition:opacity .2s;} .nav-links a:hover{opacity:1;color:var(--yellow);} .nav-cta{background:var(--red);color:var(--white);padding:10px 22px;border-radius:100px;font-size:13px;font-weight:700;transition:transform .2s,background .2s;} .nav-cta:hover{transform:translateY(-2px);background:#A8140D;} @media(max-width:860px){.nav-links{display:none;}}
        header.hero{position:relative;padding:150px 0 90px;background:radial-gradient(ellipse 70% 55% at 10% 0%,rgba(237,42,34,0.22),transparent 60%),var(--black);overflow:hidden;} .hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:56px;align-items:center;} @media(max-width:960px){.hero-grid{grid-template-columns:1fr;gap:44px;}} .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--yellow);margin-bottom:20px;} .eyebrow::before{content:"";width:24px;height:2px;background:var(--yellow);display:inline-block;} h1.hero-title{font-size:clamp(38px,6.6vw,72px);line-height:0.98;} h1.hero-title .accent{color:var(--yellow);} .hero-sub{margin-top:24px;max-width:460px;font-size:16.5px;line-height:1.65;color:rgba(251,250,247,0.7);} .hero-actions{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap;} .btn-primary{background:var(--red);color:var(--white);padding:15px 28px;border-radius:100px;font-weight:700;font-size:13.5px;transition:transform .2s,box-shadow .2s,background .2s;display:inline-flex;align-items:center;gap:8px;} .btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(237,42,34,0.35);} .btn-ghost{border:1.5px solid rgba(251,250,247,0.12);color:var(--white);padding:15px 28px;border-radius:100px;font-weight:700;font-size:13.5px;transition:border-color .2s,background .2s;} .btn-ghost:hover{border-color:var(--yellow);color:var(--yellow);} .hero-visual{position:relative;} .flash-badge{position:absolute;top:-18px;right:6%;z-index:3;background:var(--yellow);color:var(--black);width:96px;height:96px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Archivo Black',sans-serif;font-size:11px;line-height:1.2;transform:rotate(8deg);box-shadow:0 12px 26px rgba(0,0,0,0.4);} .flash-badge .big{font-size:20px;} .hero-video-card{position:relative;border-radius:22px;overflow:hidden;border:1px solid rgba(251,250,247,0.12);aspect-ratio:9/11;background:#000;box-shadow:0 30px 60px rgba(0,0,0,0.5);} .hero-video-card iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .hero-video-tag{position:absolute;bottom:16px;left:16px;z-index:3;background:rgba(10,10,10,0.7);backdrop-filter:blur(6px);padding:8px 14px;border-radius:100px;font-size:12px;font-weight:700;border:1px solid rgba(251,250,247,0.12);} .hero-video-tag span{color:var(--red);}
        .marquee{background:var(--black);border-top:1px solid rgba(251,250,247,0.12);border-bottom:1px solid rgba(251,250,247,0.12);padding:22px 0;overflow:hidden;white-space:nowrap;} .marquee-track{display:inline-block;animation:scroll 28s linear infinite;font-family:'Archivo Black',sans-serif;font-size:15px;letter-spacing:0.04em;color:rgba(251,250,247,0.35);} .marquee-track span{margin:0 30px;} .marquee-track b{color:var(--yellow);} @keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .section{padding:110px 0;} .kicker{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--red);margin-bottom:14px;} .kicker.on-dark{color:var(--yellow);} .kicker::before{content:"";width:20px;height:2px;background:currentColor;display:inline-block;} .section-title{font-size:clamp(28px,4.2vw,46px);line-height:1.06;} .section-title.dark{color:var(--black);} .section-desc{margin-top:16px;font-size:15.5px;line-height:1.7;color:rgba(251,250,247,0.62);} .section-desc.dark{color:rgba(10,10,10,0.6);}
        .tiles{background:var(--black);} .tiles-grid{display:grid;grid-template-columns:0.85fr 1.5fr;gap:36px;align-items:center;} @media(max-width:900px){.tiles-grid{grid-template-columns:1fr;}} .tiles-copy h2{font-size:clamp(28px,4.6vw,42px);line-height:1.05;} .tiles-copy h2 .accent{color:var(--yellow);} .tiles-copy p{margin-top:16px;font-size:15px;line-height:1.65;color:rgba(251,250,247,0.6);max-width:340px;} .tiles-link{display:inline-flex;align-items:center;gap:8px;margin-top:24px;font-weight:700;font-size:14px;color:var(--red);} .tile-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;} @media(max-width:640px){.tile-row{grid-template-columns:1fr;}} .tile{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:3/4;border:1px solid rgba(251,250,247,0.12);background:#000;} .tile iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .tile-label{position:absolute;left:0;right:0;bottom:0;z-index:3;background:var(--yellow);color:var(--black);padding:12px 14px;display:flex;align-items:center;gap:10px;pointer-events:none;} .tile-label .dot{width:26px;height:26px;border-radius:50%;background:var(--black);color:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;} .tile-label .txt b{display:block;font-size:12.5px;font-weight:800;} .tile-label .txt span{display:block;font-size:10.5px;opacity:0.75;}
        .services{background:var(--paper);color:var(--black);} .services .section-desc{max-width:440px;} .services-head{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px;margin-bottom:52px;} .service-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(10,10,10,0.1);border:1px solid rgba(10,10,10,0.1);} @media(max-width:960px){.service-grid{grid-template-columns:repeat(2,1fr);}} @media(max-width:560px){.service-grid{grid-template-columns:1fr;}} .service-card{background:var(--paper);padding:36px 28px;transition:background .3s ease,color .3s ease;display:flex;flex-direction:column;gap:16px;min-height:230px;} .service-card:hover{background:var(--black);} .service-card:hover h3,.service-card:hover p{color:var(--white);} .service-card:hover .service-icon{background:var(--yellow);} .service-card:hover .learn{color:var(--yellow);} .service-icon{width:44px;height:44px;border-radius:10px;background:var(--red);display:flex;align-items:center;justify-content:center;transition:background .3s ease;} .service-card h3{font-size:17.5px;font-weight:800;transition:color .3s ease;} .service-card p{font-size:13.5px;line-height:1.6;color:rgba(10,10,10,0.6);transition:color .3s ease;} .learn{margin-top:auto;font-size:12.5px;font-weight:700;color:var(--red);display:inline-flex;align-items:center;gap:6px;transition:color .3s ease;}
        .work{background:var(--black);} .work-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;} @media(max-width:900px){.work-grid{grid-template-columns:repeat(2,1fr);}} @media(max-width:600px){.work-grid{grid-template-columns:1fr;}} .work-card{border-radius:16px;overflow:hidden;border:1px solid rgba(251,250,247,0.12);background:#151515;transition:transform .35s ease,border-color .3s ease,box-shadow .3s ease;} .work-card:hover{transform:translateY(-6px);border-color:var(--yellow);box-shadow:0 20px 40px rgba(255,199,44,0.18);} .video-frame{position:relative;width:100%;aspect-ratio:9/16;background:#000;} .video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .work-caption{padding:16px 18px 20px;} .work-card .tag{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);margin-bottom:6px;} .work-card h4{font-size:15.5px;font-weight:800;}
        .process{background:var(--black);} .process-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(251,250,247,0.12);border-bottom:1px solid rgba(251,250,247,0.12);} @media(max-width:900px){.process-row{grid-template-columns:1fr 1fr;}} @media(max-width:600px){.process-row{grid-template-columns:1fr;}} .process-step{padding:32px 24px;border-right:1px solid rgba(251,250,247,0.12);} .process-step:last-child{border-right:none;} @media(max-width:900px){.process-step{border-bottom:1px solid rgba(251,250,247,0.12);}} .process-step .pnum{font-family:'Archivo Black',sans-serif;font-size:30px;color:var(--red);} .process-step h4{margin-top:14px;font-size:16px;font-weight:800;} .process-step p{margin-top:8px;font-size:13px;line-height:1.55;color:rgba(251,250,247,0.55);} .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:1px;background:var(--red);} @media(max-width:600px){.stats-row{grid-template-columns:1fr 1fr;}} .stat{background:var(--red);padding:30px 20px;text-align:center;} .stat .num{font-family:'Archivo Black',sans-serif;font-size:clamp(26px,3.4vw,38px);color:var(--black);} .stat .label{margin-top:6px;font-size:11.5px;letter-spacing:0.06em;text-transform:uppercase;color:rgba(10,10,10,0.72);font-weight:700;}
        .pricing{background:var(--black);} .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;} @media(max-width:900px){.price-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto;}} .price-card{border:1px solid rgba(251,250,247,0.12);border-radius:20px;padding:36px 30px;display:flex;flex-direction:column;gap:20px;transition:transform .3s ease,border-color .3s ease;} .price-card:hover{transform:translateY(-8px);border-color:var(--yellow);} .price-card.popular{background:var(--red);border-color:var(--red);position:relative;} .price-card.popular .badge{position:absolute;top:-14px;right:28px;background:var(--yellow);color:var(--black);font-size:11px;font-weight:800;padding:6px 14px;border-radius:100px;letter-spacing:0.04em;} .price-plan{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(251,250,247,0.6);} .price-card.popular .price-plan{color:rgba(10,10,10,0.7);} .price-amount{font-family:'Archivo Black',sans-serif;font-size:38px;} .price-amount span{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;opacity:0.6;} .price-list{display:flex;flex-direction:column;gap:10px;font-size:13.5px;} .price-list div{display:flex;align-items:center;gap:8px;color:rgba(251,250,247,0.78);} .price-card.popular .price-list div{color:rgba(10,10,10,0.85);} .price-btn{margin-top:auto;text-align:center;padding:13px;border-radius:100px;font-weight:700;font-size:13.5px;border:1.5px solid rgba(251,250,247,0.12);transition:background .2s,color .2s,border-color .2s;} .price-btn:hover{background:var(--yellow);color:var(--black);border-color:var(--yellow);} .price-card.popular .price-btn{background:var(--black);color:var(--white);border-color:var(--black);} .price-card.popular .price-btn:hover{background:var(--yellow);color:var(--black);}
        .contact{background:var(--black);padding:120px 0;} .contact-wrapper{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;} @media(max-width:900px){.contact-wrapper{grid-template-columns:1fr;gap:60px;}} .contact-info{} .contact-info h2{font-size:clamp(28px,4vw,42px);line-height:1.1;margin-bottom:32px;} .info-block{margin-bottom:48px;} .info-label{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--yellow);margin-bottom:8px;} .info-value{font-size:16px;line-height:1.6;color:rgba(251,250,247,0.8);} .info-value a{color:var(--red);transition:color .2s;} .info-value a:hover{color:var(--yellow);} .contact-form{} .form-group{margin-bottom:24px;} .form-group label{display:block;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:rgba(251,250,247,0.6);margin-bottom:8px;} .form-group input,.form-group textarea{width:100%;padding:14px;background:rgba(251,250,247,0.05);border:1px solid rgba(251,250,247,0.12);border-radius:8px;color:var(--white);font-family:inherit;font-size:14px;transition:border-color .2s,background .2s;} .form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--red);background:rgba(251,250,247,0.08);} .form-group textarea{resize:vertical;min-height:140px;} .form-submit{background:var(--red);color:var(--white);padding:16px 32px;border:none;border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;transition:background .2s,transform .2s;width:100%;} .form-submit:hover{background:#A8140D;transform:translateY(-2px);} .form-status{font-size:14px;margin-top:12px;padding:12px;border-radius:6px;text-align:center;} .form-status.success{background:rgba(34,197,94,0.2);color:#22c55e;} .form-status.error{background:rgba(239,68,68,0.2);color:#ef4444;} .cta{background:var(--yellow);color:var(--black);padding:120px 0;text-align:center;} .cta-title{font-size:clamp(30px,5.6vw,64px);line-height:1.02;max-width:760px;margin:0 auto;} .cta-sub{margin-top:18px;font-size:16px;color:rgba(10,10,10,0.7);} .cta-actions{margin-top:36px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap;} .btn-dark{background:var(--black);color:var(--white);padding:16px 30px;border-radius:100px;font-weight:700;font-size:14px;transition:transform .2s;} .btn-dark:hover{transform:translateY(-3px);} .btn-outline-dark{border:1.5px solid rgba(10,10,10,0.4);color:var(--black);padding:16px 30px;border-radius:100px;font-weight:700;font-size:14px;}
        footer{background:var(--black);padding:56px 0 30px;border-top:1px solid rgba(251,250,247,0.12);} .foot-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:30px;padding-bottom:36px;border-bottom:1px solid rgba(251,250,247,0.12);} .foot-cols{display:flex;gap:64px;flex-wrap:wrap;} .foot-col h5{font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(251,250,247,0.4);margin-bottom:14px;} .foot-col a{display:block;font-size:13.5px;margin-bottom:10px;color:rgba(251,250,247,0.72);} .foot-col a:hover{color:var(--yellow);} .foot-bottom{display:flex;justify-content:space-between;padding-top:22px;font-size:12px;color:rgba(251,250,247,0.4);flex-wrap:wrap;gap:10px;}
      `}</style>

      <nav>
        <div className="nav-inner">
          <div className="brand">
            <svg className="brand-mark" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="var(--red)"/><path d="M22 62 L34 40 L44 58 L54 38" stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M58 66 Q62 40 78 24" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="80" cy="20" r="3.4" fill="#0A0A0A"/></svg>
            <div className="brand-word">{settings.siteName || settings.brand?.logoText || 'MOTION FRANZY'} <span>{settings.brand?.logoTag || '/ AI ADS'}</span></div>
          </div>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={header.ctaLink || '#contact'}
            className="nav-cta"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate(header.ctaLink || '#contact');
            }}
          >
            {header.ctaText || "Let's Talk"}
          </a>
        </div>
      </nav>

      <header className="hero hero-slideshow-background">
        <div className="hero-bg-slides" aria-hidden="true">
          <video
            className="hero-bg-video"
            key={`${heroSlideIndex}-${currentHeroVideo.url}`}
            src={currentHeroVideo.url}
            autoPlay
            muted
            playsInline
            controls={false}
            disablePictureInPicture
            loop={heroBackgroundSlides.length === 1}
            onLoadedMetadata={(event) => scheduleHeroVideoEnd(event.currentTarget.duration)}
            onEnded={heroBackgroundSlides.length > 1 ? advanceHeroVideo : undefined}
            onError={heroBackgroundSlides.length > 1 ? skipFailedHeroVideo : undefined}
            style={heroVideoStyle}
          />
        </div>
        <div className="hero-bg-shade" aria-hidden="true" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{blocks.heroEyebrow}</div>
            <h1 className="hero-title display">{heroTitleLead}{heroAccent && <><br /><span className="accent">{heroAccent}</span></>}</h1>
            <p className="hero-sub">{hero.subtitle}</p>
            <div className="hero-actions">
              <a
                href={hero.ctaLink || '#work'}
                className="btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(hero.ctaLink || '#work');
                }}
              >
                {hero.ctaText || 'See the Work'} →
              </a>
              <a
                href="#contact"
                className="btn-ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('#contact');
                }}
              >
                {blocks.heroSecondaryCta}
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="marquee">
        <div className="marquee-track">
          {[...(blocks.marqueeItems || []), ...(blocks.marqueeItems || [])].map((item, index) => <React.Fragment key={index}><span>{item}</span><span>·</span></React.Fragment>)}
        </div>
      </div>

      <section className="section tiles">
        <div className="wrap tiles-grid">
          <div className="tiles-copy">
            <h2 className="display">{blocks.introTitle || 'NOT JUST VIDEOS,'}<br /><span className="accent">A GROWTH ENGINE.</span></h2>
            <p>{blocks.introSubtitle}</p>
            <a
              href="#work"
              className="tiles-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('#work');
              }}
            >
              {blocks.introLinkText} →
            </a>
          </div>
          <div className="tile-row">
            {(workVideos || []).slice(0, 3).map((item, index) => (
              <div className="tile" key={index}>
                <iframe src={item.video || item} allow="autoplay" allowFullScreen title={item.title || `reel-${index}`} />
                <div className="tile-label"><div className="dot">{String(index + 1).padStart(2, '0')}</div><div className="txt"><b>{item.title || `Reel ${index + 1}`}</b><span>{item.tag || 'AI Ad'}</span></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services" id="services">
        <div className="wrap">
          <div className="services-head">
            <div>
              <div className="kicker">{blocks.servicesKicker}</div>
              <h2 className="section-title dark display">{blocks.servicesTitle || 'Smart Creative For Bold Brands.'}</h2>
            </div>
            <p className="section-desc dark">{blocks.servicesDescription}</p>
          </div>
          <div className="service-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <div className="service-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M5 12 L9 16 L19 6" stroke="#0A0A0A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <a
                  href="#contact"
                  className="learn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigate('#contact');
                  }}
                >
                  {blocks.serviceLinkText} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section work" id="work">
        <div className="wrap">
          <div style={{ marginBottom: 52 }}>
            <div className="kicker on-dark">{blocks.workKicker}</div>
            <h2 className="section-title display">{blocks.workTitle || 'Real Reels, Real Brands.'}</h2>
          </div>
          <div className="work-grid">
            {(workVideos || []).map((item, index) => (
              <div className="work-card" key={index}>
                <div className="video-frame"><iframe src={item.video || item} allow="autoplay" allowFullScreen title={item.title || `work-${index}`} /></div>
                <div className="work-caption"><div className="tag">{item.tag || 'AI Ad'}</div><h4>{item.title || `Reel ${index + 1}`}</h4></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process" id="process">
        <div className="wrap section" style={{ paddingBottom: 56 }}>
          <div>
            <div className="kicker on-dark">{blocks.processKicker}</div>
            <h2 className="section-title display">{blocks.processTitle}</h2>
          </div>
        </div>
        <div className="process-row">
          {(blocks.processSteps || []).map((step, index) => <div className="process-step" key={index}><div className="pnum display">{step.number}</div><h4>{step.title}</h4><p>{step.description}</p></div>)}
        </div>
        <div className="stats-row">
          {(blocks.stats || []).map((stat, index) => <div className="stat" key={index}><div className="num display">{stat.value}</div><div className="label">{stat.label}</div></div>)}
        </div>
      </section>

      <section className="section pricing" id="pricing">
        <div className="wrap">
          <div style={{ marginBottom: 52 }}>
            <div className="kicker on-dark">{blocks.pricingKicker}</div>
            <h2 className="section-title display">{blocks.pricingTitle || 'Flexible Plans For Every Brand.'}</h2>
          </div>
          <div className="price-grid">
            {pricingPlans.map((plan, index) => (
              <div className={`price-card ${plan.popular ? 'popular' : ''}`} key={index}>
                {plan.popular && <div className="badge">Most Popular</div>}
                <div className="price-plan">{plan.name}</div>
                <div className="price-amount display">{plan.price}<span>{blocks.pricingSuffix}</span></div>
                <div className="price-list">
                  {(plan.features || []).map((feature) => <div key={feature}>✓ {feature}</div>)}
                </div>
                <a
                  href="#contact"
                  className="price-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleChoosePlan(plan);
                  }}
                >
                  {blocks.pricingButtonText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {contact.enabled && <section className="conversion-cta" aria-labelledby="conversion-cta-title">
        <div className="wrap conversion-cta-inner">
          <div className="conversion-cta-copy">
            <div className="conversion-cta-kicker">Your next winning ad starts here</div>
            <h2 className="conversion-cta-title display" id="conversion-cta-title">{blocks.ctaTitle || "Let's create something impossible to ignore."}</h2>
            <p className="conversion-cta-subtitle">{blocks.ctaSubtitle || 'Tell us what you are building. We will help turn it into creative made to perform.'}</p>
          </div>
          <div className="conversion-cta-actions">
            <a href="#contact" className="conversion-cta-primary" onClick={(e) => { e.preventDefault(); handleNavigate('#contact'); }}>
              {blocks.ctaPrimary || 'Start a Project'} <span aria-hidden="true">→</span>
            </a>
            {blocks.ctaSecondary && <a href="#contact" className="conversion-cta-secondary" onClick={(e) => { e.preventDefault(); handleNavigate('#contact'); }}>
              {blocks.ctaSecondary}
            </a>}
          </div>
        </div>
      </section>}

      {contact.enabled && <section className="contact" id="contact">
        <div className="wrap">
          <div className="contact-wrapper">
            <div className="contact-info">
              <h2 className="display">{contact.title}</h2>
              
              <div className="info-block">
                <div className="info-label">Email</div>
                <div className="info-value">
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>

              <div className="info-block">
                <div className="info-label">Phone</div>
                <div className="info-value">
                  <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}>{contact.phone}</a>
                </div>
              </div>

              <div className="info-block">
                <div className="info-label">Location</div>
                <div className="info-value">
                  {contact.address}
                </div>
              </div>

              <div className="info-block">
                <div className="info-label">Hours</div>
                <div className="info-value">
                  {contact.hours.split('\n').map((line, index) => <React.Fragment key={index}>{line}{index < contact.hours.split('\n').length - 1 && <br/>}</React.Fragment>)}
                </div>
              </div>

              <div className="info-block">
                <div className="info-label">Follow Us</div>
                <div className="info-value" style={{ display: 'flex', gap: '16px' }}>
                  <a href={footer.socialLinks?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" style={{ fontSize: '14px', fontWeight: 700 }}>Instagram →</a>
                  <a href={footer.socialLinks?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" style={{ fontSize: '14px', fontWeight: 700 }}>LinkedIn →</a>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '28px' }}>{contact.formTitle}</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="form-group">
                  <label>Message</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button type="submit" className="form-submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message →'}</button>
                {formStatus && <div className={`form-status ${formStatus.includes('filled') || formStatus.includes('error') ? 'error' : 'success'}`}>{formStatus}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>}

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="brand">
              <svg className="brand-mark" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="var(--red)"/><path d="M22 62 L34 40 L44 58 L54 38" stroke="var(--yellow)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/><path d="M58 66 Q62 40 78 24" stroke="#0A0A0A" strokeWidth="7" strokeLinecap="round" fill="none"/><circle cx="80" cy="20" r="3.4" fill="#0A0A0A"/></svg>
              <div className="brand-word">{settings.brand?.logoText || 'MOTION FRANZY'} <span>{settings.brand?.logoTag || '/ AI ADS'}</span></div>
            </div>
            <div className="foot-cols">
              <div className="foot-col"><h5>Studio</h5><a href="#services" onClick={(e) => { e.preventDefault(); handleNavigate('#services'); }}>Services</a><a href="#work" onClick={(e) => { e.preventDefault(); handleNavigate('#work'); }}>Work</a><a href="#process" onClick={(e) => { e.preventDefault(); handleNavigate('#process'); }}>Process</a><a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavigate('#pricing'); }}>Pricing</a></div>
              <div className="foot-col"><h5>Contact</h5><a href={footer.socialLinks?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer">Instagram</a><a href={footer.socialLinks?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${contact.email}`}>Email</a></div>
            </div>
          </div>
          <div className="foot-bottom">
            <div>{footer.footerText || '© 2026 Motion Franzy. All rights reserved.'}</div>
            <div>{footer.description || 'AI ads and creative systems built for modern brands.'}</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default PricingPage;
