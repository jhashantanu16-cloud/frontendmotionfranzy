export const SITE_ORIGIN = 'https://motionfranzy.com';

export const defaultSeoPages = [
  {
    key: 'home',
    label: 'Homepage',
    path: '/',
    title: 'Motion Franzy — AI Ads Agency',
    description: 'AI video ads, product commercials and social creatives for brands that want to stop the scroll.',
  },
  {
    key: 'services',
    label: 'Services',
    path: '/#services',
    title: 'AI Video Advertising Services — Motion Franzy',
    description: 'AI video ads, product commercials, campaign creatives and ad variant testing.',
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    path: '/work',
    title: 'Portfolio — Real Reels, Real Brands | Motion Franzy',
    description: 'Selected AI ad reels made for brands by Motion Franzy.',
  },
  {
    key: 'about',
    label: 'About',
    path: '',
    title: 'About Motion Franzy',
    description: 'Motion Franzy is an AI advertising studio making cinematic video ads for brands.',
  },
  {
    key: 'contact',
    label: 'Contact',
    path: '/#contact',
    title: 'Contact Motion Franzy',
    description: 'Tell Motion Franzy about your product and get a sample scroll-stop concept.',
  },
];

export const defaultSeo = {
  metaTitle: 'Motion Franzy — AI Ads Agency',
  metaDescription: 'AI video ads, product commercials and social creatives for brands that want to stop the scroll.',
  keywords: 'AI ads, AI video ads, product commercials, Motion Franzy',
  canonicalUrl: 'https://motionfranzy.com/',
  robots: 'index, follow',
  ogTitle: 'Motion Franzy — AI Ads Agency',
  ogDescription: 'AI video ads and product commercials made to stop the scroll.',
  ogImage: 'https://motionfranzy.com/motion-franzy-logo.png',
  pages: defaultSeoPages,
};
