import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import BrandLoader, { BRAND_LOGO, BRAND_FAVICON } from '../components/BrandLoader';
import { defaultSeo, defaultSeoPages, SITE_ORIGIN } from '../seoDefaults';
import defaultMarketing from '../marketingDefaults';
import './PricingPagePolish.css';

const defaultSettings = {
  siteName: 'Motion Franzy',
  header: { navItems: [{ label: 'Work', href: '#work' }, { label: 'Services', href: '#services' }, { label: 'Process', href: '#process' }, { label: 'Pricing', href: '#pricing' }], ctaText: 'Get Started', ctaLink: '#contact' },
  heroSection: { title: 'AI VIDEO ADS THAT CONVERT.', accent: 'THAT CONVERT.', subtitle: 'Create scroll-stopping video ads in minutes. Powered by AI, optimized for profit. Perfect for cosmetics, beauty, and ecommerce brands ready to scale.', ctaText: 'View Portfolio', ctaLink: '#work', backgroundOpacity: 1, backgroundSlides: [] },
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
  seo: defaultSeo,
  marketing: defaultMarketing,
};

function PricingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isWorkPage = location.pathname === '/work';
  const [settings, setSettings] = useState(defaultSettings);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [openService, setOpenService] = useState(null);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [readyHeroSources, setReadyHeroSources] = useState({});
  const [settingsReady, setSettingsReady] = useState(() => new URLSearchParams(window.location.search).has('cmsPreview'));
  const [holdDone, setHoldDone] = useState(() => new URLSearchParams(window.location.search).has('cmsPreview'));
  const heroSlideTimer = useRef(null);
  const heroVideoRefs = useRef([]);

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

    const fetchSettings = () => axios.get(`${API_BASE_URL}/api/settings`).then((res) => {
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
        marketing: {
          ...defaultMarketing,
          ...(res.data.marketing || {}),
          announcement: { ...defaultMarketing.announcement, ...(res.data.marketing?.announcement || {}) },
          offer: { ...defaultMarketing.offer, ...(res.data.marketing?.offer || {}) },
          tracking: { ...defaultMarketing.tracking, ...(res.data.marketing?.tracking || {}) },
          testimonials: res.data.marketing?.testimonials?.length ? res.data.marketing.testimonials : defaultMarketing.testimonials,
        },
      });
      setSettingsReady(true);
    }).catch(() => { setSettingsReady(true); });

    fetchSettings();
    const handleSettingsUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('settings-updated', handleSettingsUpdate);
    };
  }, []);

  const theme = { red: settings.brand?.primaryColor || '#ED2A22', yellow: settings.brand?.accentColor || '#FFC72C', black: settings.brand?.darkColor || '#0A0A0A', paper: settings.brand?.paperColor || '#F3F1EA', white: '#FBFAF7' };
  const header = settings.header || defaultSettings.header;
  const hero = settings.heroSection || defaultSettings.heroSection;
  const blocks = settings.contentBlocks || defaultSettings.contentBlocks;
  const footer = settings.footer || defaultSettings.footer;
  const contact = settings.contactSection || defaultSettings.contactSection;
  const marketing = settings.marketing || defaultMarketing;
  const announcement = marketing.announcement || defaultMarketing.announcement;
  const offer = marketing.offer || defaultMarketing.offer;
  const testimonials = (marketing.testimonials || []).filter((item) => item.quote && item.name);
  const renderBrandMark = () => (
    <img className="brand-logo" src={BRAND_LOGO} alt="Motion Franzy" />
  );
  const navItems = header.navItems || defaultSettings.header.navItems;
  const services = blocks.services || defaultSettings.contentBlocks.services;
const serviceDetailsByTitle = {
  'AI Video Generation': {
    details: 'We turn a product, offer, or brief into a finished video ad without a crew or studio day. You get a concept, generated scenes, voiceover, and an edit cut for the platforms you actually run.',
    includes: ['Concept and script from your brief', 'AI-generated product and lifestyle scenes', 'Voiceover, captions, and music', 'Revisions until the cut is ready to run'],
  },
  'Scroll-Stop Hooks': {
    details: 'Most ads lose the viewer before the product appears. We write and cut several openings so the first second earns the next one, then test which hook holds attention.',
    includes: ['Multiple hook options per ad', 'First-frame thumbnails that match the cut', 'On-screen text timed to the voiceover', 'Variants you can A/B in Meta or YouTube'],
  },
  'Multi-Format Delivery': {
    details: 'One story rarely fits every placement. We recut the same campaign for Reels, Stories, Shorts, and in-feed ads so the framing, length, and caption fit each surface.',
    includes: ['9:16, 1:1, and 16:9 exports', 'Safe-zone captions for Reels and Stories', 'Lengths for 6s, 15s, and 30s placements', 'Files named and sized for ad upload'],
  },
  'Conversion Optimized': {
    details: 'Looking good is not the brief. Each frame is built around an offer, a proof point, and a next step, so the ad can be measured against clicks, leads, or purchases.',
    includes: ['Offer and CTA written into the script', 'Proof points from your product or reviews', 'End cards with a clear next step', 'Notes on what to test next'],
  },
  'Scroll-Stop Visuals': {
    details: 'Short-form video built for the first second of a feed. We design the opening frame, the motion, and the line of text so someone scrolling actually stops.',
    includes: ['Thumb-stopping opening frame', 'Vertical cut for Reels and Shorts', 'On-screen hook in the first second', 'A version you can run as an ad'],
  },
  'Product Commercials': {
    details: 'Studio-style product films without booking a studio. We build hero shots, pack close-ups, and a simple story around the product you already sell.',
    includes: ['Hero and detail shots of the product', 'Lighting and background matched to the brand', '15s and 30s commercial cuts', 'Clean exports for site and paid social'],
  },
  'Full Advertising': {
    details: 'Creative and media thinking in one pass. We pair the film with the campaign it is meant to run in, including the hook, the audience, and the placement.',
    includes: ['Campaign concept, not just a clip', 'Meta and Instagram cutdowns', 'Primary text and headline suggestions', 'A launch-ready file set'],
  },
  'Ad Variant Testing': {
    details: 'One ad is a guess. We produce several hooks and cuts from the same brief so you can see which opening, offer, or length actually wins.',
    includes: ['3 or more hook variants', 'Same offer, different openings', 'Cuts labeled for your ad account', 'A short note on what each variant tests'],
  },
};

const serviceInfo = (service) => {
  const fallback = serviceDetailsByTitle[service.title] || {};
  const savedIncludes = (service.includes || []).map((item) => String(item).trim()).filter(Boolean);
  return {
    ...service,
    details: service.details || fallback.details || service.description,
    includes: savedIncludes.length ? savedIncludes : (fallback.includes || []),
  };
};
  const workVideos = blocks.workVideos || defaultSettings.contentBlocks.workVideos;
  const pricingPlans = blocks.pricingPlans || defaultSettings.contentBlocks.pricingPlans;
  const heroTitle = hero.title || '';
  const heroAccent = hero.accent || '';
  const heroAccentIndex = heroAccent ? heroTitle.toLowerCase().lastIndexOf(heroAccent.toLowerCase()) : -1;
  const heroTitleLead = heroAccentIndex >= 0 ? heroTitle.slice(0, heroAccentIndex).trim() : heroTitle;
  const heroBackgroundSlides = [];
  const seenHeroSlides = new Set();
  [...(hero.backgroundSlides || []), ...(hero.backgroundVideos || [])].forEach((url) => {
    const value = String(url || '').trim();
    if (!value) return;
    const driveId = value.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([^/?&#]+)/i)?.[1]
      || value.match(/\/hero\/([^/?#]+)/i)?.[1]?.replace(/\.mp4$/i, '');
    const key = (driveId || value).toLowerCase();
    if (seenHeroSlides.has(key)) return;
    seenHeroSlides.add(key);
    heroBackgroundSlides.push(value);
  });
  const heroBackgroundKey = heroBackgroundSlides.join('\n');

  useEffect(() => {
    setHeroSlideIndex(0);
  }, [heroBackgroundKey]);

  const getHeroVideoSource = (videoUrl = '') => {
    const driveFileId = videoUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([^/?&#]+)/i)?.[1];
    if (String(videoUrl).startsWith('/api/')) {
      return { type: 'file', url: `${API_BASE_URL}${videoUrl}`, local: true };
    }
    if (driveFileId) {
      return { type: 'file', url: `${API_BASE_URL}/api/media/hero/${driveFileId}.mp4`, local: true };
    }
    return { type: 'file', url: videoUrl, local: false };
  };

  useEffect(() => {
    let stopped = false;
    const check = async () => {
      const next = {};
      await Promise.all(heroBackgroundSlides.map(async (url) => {
        const source = getHeroVideoSource(url);
        if (!source.local) {
          next[url] = true;
          return;
        }
        try {
          const response = await fetch(source.url, { method: 'HEAD' });
          next[url] = response.ok;
        } catch {
          next[url] = false;
        }
      }));
      if (!stopped) {
        setReadyHeroSources((current) => {
          const same = Object.keys(next).length === Object.keys(current).length
            && Object.keys(next).every((url) => current[url] === next[url]);
          return same ? current : next;
        });
      }
    };
    check();
    const timer = window.setInterval(check, 4000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [heroBackgroundKey]);

  const playableHeroSlides = heroBackgroundSlides.filter((url) => {
    const source = getHeroVideoSource(url);
    return !source.local || readyHeroSources[url];
  });

  useEffect(() => {
    const activeIndex = playableHeroSlides.length ? heroSlideIndex % playableHeroSlides.length : 0;
    heroVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeIndex) {
        if (video.ended) video.currentTime = 0;
        const play = video.play();
        if (play && typeof play.catch === 'function') play.catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [heroSlideIndex, heroBackgroundKey, readyHeroSources]);

  const advanceHeroVideo = () => {
    window.clearTimeout(heroSlideTimer.current);
    setHeroSlideIndex((current) => current + 1);
  };

  const skipFailedHeroVideo = () => {
    window.clearTimeout(heroSlideTimer.current);
    heroSlideTimer.current = window.setTimeout(advanceHeroVideo, 4000);
  };

  const heroVideoOpacity = Math.min(1, Math.max(0, Number(hero.backgroundOpacity ?? 1)));

  const visitSource = () => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source') || params.get('utm_campaign') || '';
    if (source) sessionStorage.setItem('mf-source', source);
    return sessionStorage.getItem('mf-source') || '';
  };

  const trackMarketing = (type, label) => {
    if (new URLSearchParams(window.location.search).has('cmsPreview')) return;
    axios.post(`${API_BASE_URL}/api/marketing/event`, {
      type,
      label,
      path: window.location.pathname,
      source: visitSource(),
    }).catch(() => {});
  };

  useEffect(() => {
    if (!openService) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setOpenService(null);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openService]);

  useEffect(() => {
    const pages = settings.seo?.pages?.length ? settings.seo.pages : defaultSeoPages;
    const pageKey = isWorkPage
      ? 'portfolio'
      : (location.hash === '#services' ? 'services' : location.hash === '#contact' ? 'contact' : 'home');
    const page = pages.find((item) => item.key === pageKey) || pages.find((item) => item.key === 'home');
    const title = page?.title || settings.seo?.metaTitle || defaultSeo.metaTitle;
    const description = page?.description || settings.seo?.metaDescription || defaultSeo.metaDescription;
    const canonical = isWorkPage ? `${SITE_ORIGIN}/work` : (settings.seo?.canonicalUrl || `${SITE_ORIGIN}/`);
    const robots = settings.seo?.robots || 'index, follow';
    const ogTitle = settings.seo?.ogTitle || title;
    const ogDescription = settings.seo?.ogDescription || description;
    const ogImage = settings.seo?.ogImage || `${SITE_ORIGIN}/motion-franzy-logo.png`;
    const setMeta = (selector, create, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        Object.entries(create).forEach(([name, value]) => element.setAttribute(name, value));
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    document.title = title;
    setMeta('meta[name="description"]', { name: 'description' }, description);
    if (settings.seo?.keywords) setMeta('meta[name="keywords"]', { name: 'keywords' }, settings.seo.keywords);
    setMeta('meta[name="robots"]', { name: 'robots' }, robots);
    setMeta('meta[property="og:title"]', { property: 'og:title' }, ogTitle);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, ogDescription);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    setMeta('meta[property="og:image"]', { property: 'og:image' }, ogImage);
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, ogTitle);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, ogDescription);
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, ogImage);
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      icon.href = BRAND_FAVICON;
      icon.type = 'image/png';
    }
    const sameAs = [settings.footer?.socialLinks?.instagram, settings.footer?.socialLinks?.linkedin]
      .filter((url) => typeof url === 'string' && url.startsWith('http'));
    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${SITE_ORIGIN}/#organization`,
          name: 'Motion Franzy',
          url: `${SITE_ORIGIN}/`,
          logo: `${SITE_ORIGIN}/motion-franzy-logo.png`,
          email: settings.contactSection?.email || undefined,
          sameAs,
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_ORIGIN}/#website`,
          url: `${SITE_ORIGIN}/`,
          name: 'Motion Franzy',
          publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        },
        ...((blocks.services || []).slice(0, 4).map((service) => ({
          '@type': 'Service',
          name: service.title,
          description: service.description,
          url: `${SITE_ORIGIN}/#services`,
          provider: { '@id': `${SITE_ORIGIN}/#organization` },
          areaServed: 'Worldwide',
        }))),
      ],
    };
    let schemaScript = document.getElementById('motion-franzy-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'motion-franzy-schema';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schema);
  }, [settings.seo, settings.contactSection, settings.footer, blocks.services, isWorkPage, location.hash]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('cmsPreview')) return undefined;
    if (sessionStorage.getItem('mf-view')) return undefined;
    sessionStorage.setItem('mf-view', '1');
    trackMarketing('page_view', 'home');
    return undefined;
  }, []);

  useEffect(() => {
    const measurementId = marketing.tracking?.googleAnalyticsId?.trim();
    if (!/^G-[A-Z0-9]+$/i.test(measurementId || '') || document.getElementById('ga-script')) return undefined;
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    return undefined;
  }, [marketing.tracking?.googleAnalyticsId]);

  useEffect(() => {
    const pixelId = marketing.tracking?.metaPixelId?.trim();
    if (!/^\d{5,20}$/.test(pixelId || '') || document.getElementById('meta-pixel')) return undefined;
    const script = document.createElement('script');
    script.id = 'meta-pixel';
    script.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
    document.head.appendChild(script);
    return undefined;
  }, [marketing.tracking?.metaPixelId]);

  const handleNavigate = (target) => {
    if (!target) return;

    if (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:')) {
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (target.startsWith('/')) {
      navigate(target);
      window.scrollTo(0, 0);
      return;
    }

    if (target.startsWith('#')) {
      if (location.pathname !== '/') {
        navigate(`/${target}`);
        return;
      }
      const element = document.getElementById(target.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.hash = target;
      }
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
      await axios.post(`${API_BASE_URL}/api/contact`, {
        ...contactForm,
        plan: selectedPlan?.name || '',
        price: selectedPlan?.price || '',
        source: visitSource(),
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

  useEffect(() => {
    const hold = setTimeout(() => setHoldDone(true), 700);
    const cap = setTimeout(() => setSettingsReady(true), 1600);
    return () => {
      clearTimeout(hold);
      clearTimeout(cap);
    };
  }, []);

  const showLoader = !(settingsReady && holdDone);

  return (
    <>
      {showLoader && <BrandLoader />}
      <style>{`
        :root { --red: ${theme.red}; --yellow: ${theme.yellow}; --black: ${theme.black}; --paper: ${theme.paper}; --white: ${theme.white}; }
        *{margin:0;padding:0;box-sizing:border-box;} html{scroll-behavior:smooth;} body{background:var(--black);color:var(--white);font-family:'Inter',sans-serif;overflow-x:hidden;} a{color:inherit;text-decoration:none;} img,iframe{max-width:100%;display:block;} .display{font-family:'Archivo Black',sans-serif;text-transform:uppercase;letter-spacing:-0.01em;} .script{font-family:'Caveat',cursive;} .wrap{max-width:1200px;margin:0 auto;padding:0 32px;} @media(max-width:640px){.wrap{padding:0 20px;}}
        nav{position:fixed;top:0;left:0;right:0;z-index:100;background:#0a0a0a;border-bottom:1px solid rgba(251,250,247,0.12);} .nav-inner{max-width:1200px;margin:0 auto;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;} .brand{display:flex;align-items:center;flex:0 0 auto;} .brand-logo{height:118px;width:auto;max-width:none;object-fit:contain;flex-shrink:0;} footer .brand-logo{height:196px;} .nav-links{display:flex;gap:34px;font-size:13.5px;font-weight:600;} .nav-links a{opacity:0.72;transition:opacity .2s;} .nav-links a:hover{opacity:1;color:var(--yellow);} .nav-cta{background:var(--red);color:var(--white);padding:10px 22px;border-radius:100px;font-size:13px;font-weight:700;transition:transform .2s,background .2s;} .nav-cta:hover{transform:translateY(-2px);background:#A8140D;} @media(max-width:860px){.nav-links{display:none;} .brand-logo{height:88px;} footer .brand-logo{height:150px;}}
        header.hero{position:relative;padding:210px 0 90px;background:radial-gradient(ellipse 70% 55% at 10% 0%,rgba(237,42,34,0.22),transparent 60%),var(--black);overflow:hidden;} .hero-grid{display:grid;grid-template-columns:1.05fr 0.95fr;gap:56px;align-items:center;} @media(max-width:960px){.hero-grid{grid-template-columns:1fr;gap:44px;}} .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--yellow);margin-bottom:20px;} .eyebrow::before{content:"";width:24px;height:2px;background:var(--yellow);display:inline-block;} h1.hero-title{font-size:clamp(38px,6.6vw,72px);line-height:0.98;} h1.hero-title .accent{color:var(--yellow);} .hero-sub{margin-top:24px;max-width:460px;font-size:16.5px;line-height:1.65;color:rgba(251,250,247,0.7);} .hero-actions{display:flex;gap:14px;margin-top:34px;flex-wrap:wrap;} .btn-primary{background:var(--red);color:var(--white);padding:15px 28px;border-radius:100px;font-weight:700;font-size:13.5px;transition:transform .2s,box-shadow .2s,background .2s;display:inline-flex;align-items:center;gap:8px;} .btn-primary:hover{transform:translateY(-3px);box-shadow:0 14px 28px rgba(237,42,34,0.35);} .btn-ghost{border:1.5px solid rgba(251,250,247,0.12);color:var(--white);padding:15px 28px;border-radius:100px;font-weight:700;font-size:13.5px;transition:border-color .2s,background .2s;} .btn-ghost:hover{border-color:var(--yellow);color:var(--yellow);} .hero-visual{position:relative;} .flash-badge{position:absolute;top:-18px;right:6%;z-index:3;background:var(--yellow);color:var(--black);width:96px;height:96px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-family:'Archivo Black',sans-serif;font-size:11px;line-height:1.2;transform:rotate(8deg);box-shadow:0 12px 26px rgba(0,0,0,0.4);} .flash-badge .big{font-size:20px;} .hero-video-card{position:relative;border-radius:22px;overflow:hidden;border:1px solid rgba(251,250,247,0.12);aspect-ratio:9/11;background:#000;box-shadow:0 30px 60px rgba(0,0,0,0.5);} .hero-video-card iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .hero-video-tag{position:absolute;bottom:16px;left:16px;z-index:3;background:rgba(10,10,10,0.7);backdrop-filter:blur(6px);padding:8px 14px;border-radius:100px;font-size:12px;font-weight:700;border:1px solid rgba(251,250,247,0.12);} .hero-video-tag span{color:var(--red);}
        .marquee{background:var(--black);border-top:1px solid rgba(251,250,247,0.12);border-bottom:1px solid rgba(251,250,247,0.12);padding:22px 0;overflow:hidden;white-space:nowrap;} .marquee-track{display:inline-block;animation:scroll 28s linear infinite;font-family:'Archivo Black',sans-serif;font-size:15px;letter-spacing:0.04em;color:rgba(251,250,247,0.35);} .marquee-track span{margin:0 30px;} .marquee-track b{color:var(--yellow);} @keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}
        .section{padding:110px 0;} .kicker{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--red);margin-bottom:14px;} .kicker.on-dark{color:var(--yellow);} .kicker::before{content:"";width:20px;height:2px;background:currentColor;display:inline-block;} .section-title{font-size:clamp(28px,4.2vw,46px);line-height:1.06;} .section-title.dark{color:var(--black);} .section-desc{margin-top:16px;font-size:15.5px;line-height:1.7;color:rgba(251,250,247,0.62);} .section-desc.dark{color:rgba(10,10,10,0.6);}
        .tiles{background:var(--black);} .tiles-grid{display:grid;grid-template-columns:0.85fr 1.5fr;gap:36px;align-items:center;} @media(max-width:900px){.tiles-grid{grid-template-columns:1fr;}} .tiles-copy h2{font-size:clamp(28px,4.6vw,42px);line-height:1.05;} .tiles-copy h2 .accent{color:var(--yellow);} .tiles-copy p{margin-top:16px;font-size:15px;line-height:1.65;color:rgba(251,250,247,0.6);max-width:340px;} .tiles-link{display:inline-flex;align-items:center;gap:8px;margin-top:24px;font-weight:700;font-size:14px;color:var(--red);} .tile-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;} @media(max-width:640px){.tile-row{grid-template-columns:1fr;}} .tile{position:relative;border-radius:16px;overflow:hidden;aspect-ratio:3/4;border:1px solid rgba(251,250,247,0.12);background:#000;} .tile iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .tile-label{position:absolute;left:0;right:0;bottom:0;z-index:3;background:var(--yellow);color:var(--black);padding:12px 14px;display:flex;align-items:center;gap:10px;pointer-events:none;} .tile-label .dot{width:26px;height:26px;border-radius:50%;background:var(--black);color:var(--yellow);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;} .tile-label .txt b{display:block;font-size:12.5px;font-weight:800;} .tile-label .txt span{display:block;font-size:10.5px;opacity:0.75;}
        .services{background:var(--paper);color:var(--black);} .services .section-desc{max-width:440px;} .services-head{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:20px;margin-bottom:52px;} .service-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(10,10,10,0.1);border:1px solid rgba(10,10,10,0.1);} @media(max-width:960px){.service-grid{grid-template-columns:repeat(2,1fr);}} @media(max-width:560px){.service-grid{grid-template-columns:1fr;}} .service-card{background:var(--paper);padding:36px 28px;transition:background .3s ease,color .3s ease;display:flex;flex-direction:column;gap:16px;min-height:230px;} .service-card:hover{background:var(--black);} .service-card:hover h3,.service-card:hover p{color:var(--white);} .service-card:hover .service-icon{background:var(--yellow);} .service-card:hover .learn{color:var(--yellow);} .service-icon{width:44px;height:44px;border-radius:10px;background:var(--red);display:flex;align-items:center;justify-content:center;transition:background .3s ease;} .service-card h3{font-size:17.5px;font-weight:800;transition:color .3s ease;} .service-card p{font-size:13.5px;line-height:1.6;color:rgba(10,10,10,0.6);transition:color .3s ease;} .learn{margin-top:auto;font-size:12.5px;font-weight:700;color:var(--red);display:inline-flex;align-items:center;gap:6px;transition:color .3s ease;background:none;border:0;padding:0;cursor:pointer;text-align:left;font-family:inherit;} .service-modal{position:fixed;inset:0;z-index:200;background:rgba(10,10,10,0.72);display:grid;place-items:center;padding:24px;} .service-modal-card{width:min(640px,100%);max-height:min(86vh,760px);overflow:auto;background:var(--paper);color:var(--black);border-radius:22px;padding:32px 28px;position:relative;} .service-modal-close{position:absolute;top:16px;right:16px;border:0;background:transparent;font-weight:800;cursor:pointer;font-family:inherit;} .service-modal-card h2{font-size:clamp(28px,4vw,42px);line-height:1.05;margin:8px 48px 16px 0;} .service-modal-card p{font-size:16px;line-height:1.65;color:rgba(10,10,10,0.72);} .service-modal-card ul{margin:22px 0 0;padding:0;list-style:none;display:grid;gap:10px;} .service-modal-card li{display:flex;gap:10px;font-weight:650;font-size:14.5px;} .service-modal-card li::before{content:"✓";color:var(--red);font-weight:800;} .service-modal-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:28px;} .service-modal-primary,.service-modal-secondary{border-radius:100px;padding:13px 22px;font-weight:800;cursor:pointer;font-family:inherit;} .service-modal-primary{background:var(--red);color:var(--white);border:0;} .service-modal-secondary{background:transparent;border:1.5px solid rgba(10,10,10,0.2);}
        .work{background:var(--black);} .work-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;} @media(max-width:900px){.work-grid{grid-template-columns:repeat(2,1fr);}} @media(max-width:600px){.work-grid{grid-template-columns:1fr;}} .work-card{border-radius:16px;overflow:hidden;border:1px solid rgba(251,250,247,0.12);background:#151515;transition:transform .35s ease,border-color .3s ease,box-shadow .3s ease;} .work-card:hover{transform:translateY(-6px);border-color:var(--yellow);box-shadow:0 20px 40px rgba(255,199,44,0.18);} .video-frame{position:relative;width:100%;aspect-ratio:9/16;background:#000;} .video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0;} .work-caption{padding:16px 18px 20px;} .work-card .tag{font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);margin-bottom:6px;} .work-card h3{font-size:15.5px;font-weight:800;}
        .process{background:var(--black);} .process-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid rgba(251,250,247,0.12);border-bottom:1px solid rgba(251,250,247,0.12);} @media(max-width:900px){.process-row{grid-template-columns:1fr 1fr;}} @media(max-width:600px){.process-row{grid-template-columns:1fr;}} .process-step{padding:32px 24px;border-right:1px solid rgba(251,250,247,0.12);} .process-step:last-child{border-right:none;} @media(max-width:900px){.process-step{border-bottom:1px solid rgba(251,250,247,0.12);}} .process-step .pnum{font-family:'Archivo Black',sans-serif;font-size:30px;color:var(--red);} .process-step h3{margin-top:14px;font-size:16px;font-weight:800;} .process-step p{margin-top:8px;font-size:13px;line-height:1.55;color:rgba(251,250,247,0.55);} .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:1px;background:var(--red);} @media(max-width:600px){.stats-row{grid-template-columns:1fr 1fr;}} .stat{background:var(--red);padding:30px 20px;text-align:center;} .stat .num{font-family:'Archivo Black',sans-serif;font-size:clamp(26px,3.4vw,38px);color:var(--black);} .stat .label{margin-top:6px;font-size:11.5px;letter-spacing:0.06em;text-transform:uppercase;color:rgba(10,10,10,0.72);font-weight:700;}
        .pricing{background:var(--black);} .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;} @media(max-width:900px){.price-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto;}} .price-card{border:1px solid rgba(251,250,247,0.12);border-radius:20px;padding:36px 30px;display:flex;flex-direction:column;gap:20px;transition:transform .3s ease,border-color .3s ease;} .price-card:hover{transform:translateY(-8px);border-color:var(--yellow);} .price-card.popular{background:var(--red);border-color:var(--red);position:relative;} .price-card.popular .badge{position:absolute;top:-14px;right:28px;background:var(--yellow);color:var(--black);font-size:11px;font-weight:800;padding:6px 14px;border-radius:100px;letter-spacing:0.04em;} .price-plan{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(251,250,247,0.6);} .price-card.popular .price-plan{color:rgba(10,10,10,0.7);} .price-amount{font-family:'Archivo Black',sans-serif;font-size:38px;} .price-amount span{font-family:'Inter',sans-serif;font-size:13px;font-weight:600;opacity:0.6;} .price-list{display:flex;flex-direction:column;gap:10px;font-size:13.5px;} .price-list div{display:flex;align-items:center;gap:8px;color:rgba(251,250,247,0.78);} .price-card.popular .price-list div{color:rgba(10,10,10,0.85);} .price-btn{margin-top:auto;text-align:center;padding:13px;border-radius:100px;font-weight:700;font-size:13.5px;border:1.5px solid rgba(251,250,247,0.12);transition:background .2s,color .2s,border-color .2s;} .price-btn:hover{background:var(--yellow);color:var(--black);border-color:var(--yellow);} .price-card.popular .price-btn{background:var(--black);color:var(--white);border-color:var(--black);} .price-card.popular .price-btn:hover{background:var(--yellow);color:var(--black);}
        .contact{background:var(--black);padding:120px 0;} .contact-wrapper{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start;} @media(max-width:900px){.contact-wrapper{grid-template-columns:1fr;gap:60px;}} .contact-info{} .contact-info h2{font-size:clamp(28px,4vw,42px);line-height:1.1;margin-bottom:32px;} .info-block{margin-bottom:48px;} .info-label{font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--yellow);margin-bottom:8px;} .info-value{font-size:16px;line-height:1.6;color:rgba(251,250,247,0.8);} .info-value a{color:var(--red);transition:color .2s;} .info-value a:hover{color:var(--yellow);} .contact-form{} .form-group{margin-bottom:24px;} .form-group label{display:block;font-size:12px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:rgba(251,250,247,0.6);margin-bottom:8px;} .form-group input,.form-group textarea{width:100%;padding:14px;background:rgba(251,250,247,0.05);border:1px solid rgba(251,250,247,0.12);border-radius:8px;color:var(--white);font-family:inherit;font-size:14px;transition:border-color .2s,background .2s;} .form-group input:focus,.form-group textarea:focus{outline:none;border-color:var(--red);background:rgba(251,250,247,0.08);} .form-group textarea{resize:vertical;min-height:140px;} .form-submit{background:var(--red);color:var(--white);padding:16px 32px;border:none;border-radius:100px;font-weight:700;font-size:14px;cursor:pointer;transition:background .2s,transform .2s;width:100%;} .form-submit:hover{background:#A8140D;transform:translateY(-2px);} .form-status{font-size:14px;margin-top:12px;padding:12px;border-radius:6px;text-align:center;} .form-status.success{background:rgba(34,197,94,0.2);color:#22c55e;} .form-status.error{background:rgba(239,68,68,0.2);color:#ef4444;} .cta{background:var(--yellow);color:var(--black);padding:120px 0;text-align:center;} .cta-title{font-size:clamp(30px,5.6vw,64px);line-height:1.02;max-width:760px;margin:0 auto;} .cta-sub{margin-top:18px;font-size:16px;color:rgba(10,10,10,0.7);} .cta-actions{margin-top:36px;display:flex;justify-content:center;gap:14px;flex-wrap:wrap;} .btn-dark{background:var(--black);color:var(--white);padding:16px 30px;border-radius:100px;font-weight:700;font-size:14px;transition:transform .2s;} .btn-dark:hover{transform:translateY(-3px);} .btn-outline-dark{border:1.5px solid rgba(10,10,10,0.4);color:var(--black);padding:16px 30px;border-radius:100px;font-weight:700;font-size:14px;}
        .announce-bar{display:block;background:var(--yellow);color:var(--black);text-align:center;font-size:13px;font-weight:800;padding:10px 18px;} .announce-bar span{margin-left:8px;text-decoration:underline;}
        .proof{background:var(--black);} .proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:36px;} @media(max-width:900px){.proof-grid{grid-template-columns:1fr;}} .proof-card{border:1px solid rgba(251,250,247,0.12);border-radius:18px;padding:28px 24px;display:flex;flex-direction:column;gap:18px;min-height:240px;background:linear-gradient(180deg,rgba(255,199,44,0.08),transparent 42%);} .proof-result{align-self:flex-start;background:var(--yellow);color:var(--black);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;} .proof-card q{font-size:18px;line-height:1.45;font-weight:600;} .proof-person{color:rgba(251,250,247,0.62);font-size:13px;} .proof-person strong{display:block;color:var(--white);font-size:14px;}
        .offer-banner{display:flex;justify-content:space-between;gap:24px;align-items:center;flex-wrap:wrap;background:var(--yellow);color:var(--black);border-radius:18px;padding:22px 26px;margin-bottom:28px;} .offer-banner .badge{background:var(--black);color:var(--yellow);} .offer-banner h3{font-size:22px;margin-top:8px;} .offer-banner p{max-width:460px;margin-top:6px;color:rgba(10,10,10,0.72);} .offer-banner a{background:var(--black);color:var(--white);border-radius:999px;padding:12px 18px;font-weight:800;font-size:13px;}
        footer{background:var(--black);padding:56px 0 30px;border-top:1px solid rgba(251,250,247,0.12);} .foot-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:30px;padding-bottom:36px;border-bottom:1px solid rgba(251,250,247,0.12);} .foot-cols{display:flex;gap:64px;flex-wrap:wrap;} .foot-col .foot-label{font-size:11.5px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(251,250,247,0.4);margin:0 0 14px;} .foot-col a{display:block;font-size:13.5px;margin-bottom:10px;color:rgba(251,250,247,0.72);} .foot-col a:hover{color:var(--yellow);} .foot-bottom{display:flex;justify-content:space-between;padding-top:22px;font-size:12px;color:rgba(251,250,247,0.4);flex-wrap:wrap;gap:10px;}
      `}</style>

      <nav>
        {announcement.enabled && announcement.text && (
          <a
            className="announce-bar"
            href={announcement.link || '#contact'}
            onClick={(e) => {
              e.preventDefault();
              trackMarketing('cta_click', 'Announcement');
              handleNavigate(announcement.link || '#contact');
            }}
          >
            {announcement.text}{announcement.linkLabel && <span>{announcement.linkLabel}</span>}
          </a>
        )}
        <div className="nav-inner">
          <div className="brand">
            {renderBrandMark()}
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
              trackMarketing('cta_click', 'Header');
              handleNavigate(header.ctaLink || '#contact');
            }}
          >
            {header.ctaText || "Let's Talk"}
          </a>
        </div>
      </nav>

      {!isWorkPage && <>
      <header className="hero hero-slideshow-background">
        <div className="hero-bg-slides" aria-hidden="true" style={{ '--hero-video-opacity': heroVideoOpacity }}>
          {playableHeroSlides.map((url, index) => {
            const source = getHeroVideoSource(url);
            const active = index === heroSlideIndex % playableHeroSlides.length;
            return (
              <video
                className={`hero-bg-video${active ? ' is-active' : ''}`}
                key={source.url}
                ref={(node) => { heroVideoRefs.current[index] = node; }}
                src={source.url}
                autoPlay={active}
                muted
                playsInline
                preload={active ? 'metadata' : 'none'}
                controls={false}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                loop={playableHeroSlides.length === 1}
                onEnded={playableHeroSlides.length > 1 ? advanceHeroVideo : undefined}
                onError={playableHeroSlides.length > 1 ? skipFailedHeroVideo : undefined}
              />
            );
          })}
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
                  trackMarketing('cta_click', hero.ctaText || 'Hero');
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
                  trackMarketing('cta_click', blocks.heroSecondaryCta || 'Hero secondary');
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
                <iframe src={item.video || item} loading="lazy" allow="autoplay" allowFullScreen title={item.title || `reel-${index}`} />
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
                <button
                  type="button"
                  className="learn"
                  onClick={() => {
                    trackMarketing('cta_click', `Learn more: ${service.title}`);
                    setOpenService(serviceInfo(service));
                  }}
                >
                  {blocks.serviceLinkText} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      </>}

      <section className="section work" id="work" style={isWorkPage ? { paddingTop: 140 } : undefined}>
        <div className="wrap">
          <div className="work-heading">
            <div>
              <div className="kicker on-dark">{blocks.workKicker}</div>
              {isWorkPage ? (
                <h1 className="section-title display">{blocks.workTitle || 'Real Reels, Real Brands.'}</h1>
              ) : (
                <h2 className="section-title display">{blocks.workTitle || 'Real Reels, Real Brands.'}</h2>
              )}
            </div>
            {isWorkPage && (
              <a href="/" className="work-more" onClick={(e) => { e.preventDefault(); handleNavigate('/'); }}>←</a>
            )}
          </div>
          <div className={isWorkPage ? 'work-grid' : 'work-row'}>
            {(isWorkPage ? workVideos : (workVideos || []).slice(0, 5)).map((item, index) => (
              <div className="work-card" key={index}>
                <div className="video-frame"><iframe src={item.video || item} loading="lazy" allow="autoplay" allowFullScreen title={item.title || `work-${index}`} /></div>
                <div className="work-caption"><div className="tag">{item.tag || 'AI Ad'}</div><h3>{item.title || `Reel ${index + 1}`}</h3></div>
              </div>
            ))}
            {!isWorkPage && (
              <a href="/work" className="work-more-card" onClick={(e) => { e.preventDefault(); handleNavigate('/work'); }}>
                <span className="work-more-arrow" aria-hidden="true">→</span>
                <span>More</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {!isWorkPage && <>
      <section className="process" id="process">
        <div className="wrap section" style={{ paddingBottom: 56 }}>
          <div>
            <div className="kicker on-dark">{blocks.processKicker}</div>
            <h2 className="section-title display">{blocks.processTitle}</h2>
          </div>
        </div>
        <div className="process-row">
          {(blocks.processSteps || []).map((step, index) => <div className="process-step" key={index}><div className="pnum display">{step.number}</div><h3>{step.title}</h3><p>{step.description}</p></div>)}
        </div>
        <div className="stats-row">
          {(blocks.stats || []).map((stat, index) => <div className="stat" key={index}><div className="num display">{stat.value}</div><div className="label">{stat.label}</div></div>)}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section proof" id="results">
          <div className="wrap">
            <div className="kicker on-dark">Client proof</div>
            <h2 className="section-title display">What brands say after the first reel.</h2>
            <div className="proof-grid">
              {testimonials.map((item) => (
                <article className="proof-card" key={`${item.name}-${item.result}`}>
                  {item.result && <div className="proof-result">{item.result}</div>}
                  <q>{item.quote}</q>
                  <div className="proof-person"><strong>{item.name}</strong>{item.role}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section pricing" id="pricing">
        <div className="wrap">
          {offer.enabled && offer.title && (
            <div className="offer-banner">
              <div>
                {offer.badge && <div className="badge">{offer.badge}</div>}
                <h3 className="display">{offer.title}</h3>
                {offer.detail && <p>{offer.detail}</p>}
              </div>
              <a href="#contact" onClick={(e) => { e.preventDefault(); trackMarketing('cta_click', 'Offer'); handleNavigate('#contact'); }}>Get the concept</a>
            </div>
          )}
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
                    trackMarketing('cta_click', `Plan: ${plan.name}`);
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
            <a href="#contact" className="conversion-cta-primary" onClick={(e) => { e.preventDefault(); trackMarketing('cta_click', blocks.ctaPrimary || 'Start a Project'); handleNavigate('#contact'); }}>
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
                <div className="social-links">
                  <a className="social-link" href={footer.socialLinks?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm5 4.2A4.8 4.8 0 1016.8 12 4.8 4.8 0 0012 7.2zm0 1.8a3 3 0 11-3 3 3 3 0 013-3zm5.4-2.5a1.1 1.1 0 11-1.1 1.1 1.1 1.1 0 011.1-1.1z"/></svg>
                    Instagram
                  </a>
                  <a className="social-link" href={footer.socialLinks?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.7 3.2A2.2 2.2 0 112.5 5.4a2.2 2.2 0 012.2-2.2zM3 8.4h3.4V21H3zM9.2 8.4h3.3v1.7h.1c.5-1 1.6-2 3.3-2 3.5 0 4.2 2.3 4.2 5.3V21H16.7v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9.2z"/></svg>
                    LinkedIn
                  </a>
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
      </>}

      {openService && (
        <div className="service-modal" onClick={() => setOpenService(null)}>
          <div className="service-modal-card" role="dialog" aria-modal="true" aria-labelledby="service-modal-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="service-modal-close" onClick={() => setOpenService(null)}>Close</button>
            <div className="kicker">{blocks.servicesKicker || 'What We Do'}</div>
            <h2 className="display" id="service-modal-title">{openService.title}</h2>
            <p>{openService.details}</p>
            {openService.includes.length > 0 && (
              <ul>
                {openService.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            <div className="service-modal-actions">
              <button
                type="button"
                className="service-modal-primary"
                onClick={() => {
                  setContactForm((current) => ({
                    ...current,
                    message: current.message || `I'm interested in ${openService.title}.`,
                  }));
                  setOpenService(null);
                  handleNavigate('#contact');
                }}
              >
                Start this service
              </button>
              <button type="button" className="service-modal-secondary" onClick={() => setOpenService(null)}>Back to services</button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="wrap">
          <div className="foot-top">
            <div className="brand">
              {renderBrandMark()}
            </div>
            <div className="foot-cols">
              <div className="foot-col"><p className="foot-label">Studio</p><a href="#services" onClick={(e) => { e.preventDefault(); handleNavigate('#services'); }}>Services</a><a href="/work" onClick={(e) => { e.preventDefault(); handleNavigate('/work'); }}>Portfolio</a><a href="#process" onClick={(e) => { e.preventDefault(); handleNavigate('#process'); }}>Process</a><a href="#pricing" onClick={(e) => { e.preventDefault(); handleNavigate('#pricing'); }}>Pricing</a><a href="#contact" onClick={(e) => { e.preventDefault(); handleNavigate('#contact'); }}>Contact</a></div>
              <div className="foot-col"><p className="foot-label">Contact</p><a href={footer.socialLinks?.instagram || 'https://instagram.com'} target="_blank" rel="noreferrer">Instagram</a><a href={footer.socialLinks?.linkedin || 'https://linkedin.com'} target="_blank" rel="noreferrer">LinkedIn</a><a href={`mailto:${contact.email}`}>Email</a></div>
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
