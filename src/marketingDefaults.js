const defaultMarketing = {
  announcement: {
    enabled: true,
    text: 'New brands get a free sample reel this month.',
    linkLabel: 'Claim yours',
    link: '#contact',
  },
  offer: {
    enabled: true,
    badge: 'Launch offer',
    title: 'Your first concept is on us.',
    detail: 'Tell us about the product. We reply with one scroll-stop concept before you pick a plan.',
  },
  testimonials: [
    { quote: 'The first cut looked like a studio shoot. We ran it the same week.', name: 'Beauty founder', role: 'Skincare brand', result: 'Live in 5 days' },
    { quote: 'We finally had hooks worth testing, without booking a crew.', name: 'Ecommerce lead', role: 'DTC brand', result: '4 ad variants' },
    { quote: 'Clear offer, fast revisions, and files ready for Meta.', name: 'Marketing manager', role: 'Cosmetics', result: 'Meta-ready' },
  ],
  tracking: {
    googleAnalyticsId: '',
    metaPixelId: '',
  },
};

export default defaultMarketing;
