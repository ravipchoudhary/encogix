const PHONE = '+91 9431607346';
const EMAIL = 'contact@encogix.com';
const ADDRESS = 'Gaur City Center, Greater Noida, Uttar Pradesh, 201318';

const KNOWLEDGE = {
  website: {
    keywords: ['website', 'web development', 'static', 'dynamic', 'business website', 'portfolio', 'corporate', 'landing page', 'web site', 'website development'],
    reply: 'Encogix offers Website Development: static websites (₹15,000+), dynamic business sites (₹35,000+), portfolio, corporate & landing pages. Includes mobile-responsive design, SEO, contact forms & WhatsApp integration. Timeline: 2–4 weeks for standard sites.',
    hindi: 'Encogix website banata hai — static ₹15,000 se, dynamic business site ₹35,000 se. Mobile friendly, SEO, WhatsApp button sab included. 2-4 week mein ready.',
  },
  ecommerce: {
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'cart', 'checkout', 'payment gateway', 'inventory'],
    reply: 'Ecommerce Development includes product listing, cart, checkout, Razorpay/payment gateway, order management, admin panel & inventory. Starting from ₹75,000. Timeline: 4–8 weeks.',
    hindi: 'Ecommerce website mein product listing, cart, payment gateway, admin panel sab milta hai. ₹75,000 se start. 4-8 weeks.',
  },
  mobile: {
    keywords: ['mobile app', 'android', 'ios', 'app development', 'hybrid', 'flutter', 'react native'],
    reply: 'Mobile App Development: Android, iOS & hybrid apps (React Native/Flutter). Real estate, ecommerce & business apps. Custom quote based on features. Timeline: 6–12 weeks.',
    hindi: 'Android, iOS aur hybrid mobile app banate hain. Features ke hisaab se price. 6-12 weeks lagte hain.',
  },
  crm: {
    keywords: ['crm', 'erp', 'complaint', 'lead management', 'custom software', 'automation', 'business software'],
    reply: 'Custom Software & CRM: lead management, complaint management, ERP, business automation tools with role-based dashboards. Starting from ₹1,50,000. Timeline: 8–16 weeks.',
    hindi: 'CRM, complaint management, lead tracking software banate hain. ₹1,50,000 se start. 8-16 weeks.',
  },
  ai: {
    keywords: ['ai', 'chatbot', 'calling agent', 'automation', 'bot', 'artificial intelligence', 'whatsapp bot'],
    reply: 'AI Solutions: AI chatbot, AI calling agent, customer support bot, lead generation bot & workflow automation. Integrates with website & WhatsApp. Custom pricing.',
    hindi: 'AI chatbot, calling agent, WhatsApp bot aur automation solutions dete hain. Custom pricing.',
  },
  seo: {
    keywords: ['seo', 'digital marketing', 'google', 'ranking', 'local seo', 'social media', 'marketing', 'whatsapp marketing'],
    reply: 'SEO & Digital Marketing: on-page, off-page, technical & local SEO, Google Business Profile, social media marketing, WhatsApp Marketing API. Monthly packages from ₹8,000.',
    hindi: 'SEO, Google ranking, local SEO, social media marketing aur WhatsApp marketing API. ₹8,000/month se packages.',
  },
  hosting: {
    keywords: ['hosting', 'domain', 'ssl', 'maintenance', 'speed', 'security', 'host'],
    reply: 'Hosting & Maintenance: domain setup, hosting, SSL, monthly maintenance, speed optimization & security updates. Plans from ₹3,000/month.',
    hindi: 'Domain, hosting, SSL, website maintenance aur speed optimization. ₹3,000/month se plans.',
  },
  pricing: {
    keywords: ['price', 'pricing', 'cost', 'kitna', 'rate', 'budget', 'package', 'starting'],
    reply: 'Pricing: Static website from ₹15,000 | Business website ₹35,000 | Ecommerce ₹75,000 | CRM/Software ₹1,50,000+ | SEO from ₹8,000/month | Maintenance from ₹3,000/month. Free consultation available!',
    hindi: 'Price: Website ₹15,000 se, Business site ₹35,000, Ecommerce ₹75,000, CRM ₹1,50,000+. SEO ₹8,000/month se. Free consultation lo!',
  },
  timeline: {
    keywords: ['timeline', 'time', 'kitne din', 'how long', 'duration', 'weeks', 'delivery'],
    reply: 'Typical timelines: Website 2–4 weeks | Ecommerce 4–8 weeks | Mobile app 6–12 weeks | CRM/Software 8–16 weeks | SEO results in 2–3 months.',
    hindi: 'Website 2-4 week, ecommerce 4-8 week, app 6-12 week, CRM 8-16 week. SEO mein 2-3 month mein results.',
  },
  internship: {
    keywords: ['internship', 'intern', 'training', 'fresher', 'student'],
    reply: 'Internship Program: Web Development, Software Development, UI/UX & Digital Marketing. Visit encogix.com/internship to apply.',
    hindi: 'Internship Web Dev, Software, UI/UX aur Digital Marketing mein available hai. /internship page par apply karo.',
  },
  contact: {
    keywords: ['contact', 'phone', 'call', 'email', 'address', 'office', 'location', 'noida', 'where'],
    reply: `Contact Encogix: Phone ${PHONE} | Email ${EMAIL} | Office: ${ADDRESS}. Also Bihar office: Near BM College, Rahika, Madhubani.`,
    hindi: `Call karo ${PHONE} ya email ${EMAIL}. Office: ${ADDRESS} (Greater Noida).`,
  },
  career: {
    keywords: ['job', 'career', 'hiring', 'vacancy', 'opening', 'recruit'],
    reply: 'Current job openings are listed at encogix.com/career. You can apply directly through each job listing.',
    hindi: 'Jobs encogix.com/career par dekho aur apply karo.',
  },
};

function isHindi(text) {
  return /[\u0900-\u097F]/.test(text) || /\b(kya|kaise|kitna|hai|hain|chahiye|banwana|banwani|price|batao|bataiye|karo|karein)\b/i.test(text);
}

function findTopic(lower) {
  for (const [key, data] of Object.entries(KNOWLEDGE)) {
    if (data.keywords.some((k) => lower.includes(k))) return { key, data };
  }
  return null;
}

function getChatbotReply(message) {
  const lower = (message || '').toLowerCase().trim();
  const hindi = isHindi(message || '');

  if (!lower) return hindi ? 'Namaste! Encogix Technology mein aapka swagat hai. Kaise madad kar sakte hain?' : 'Welcome to Encogix Technology! How can we help you today?';

  if (/^(hi|hello|hey|namaste|namaskar)/.test(lower)) {
    return hindi
      ? 'Namaste! 👋 Main Encogix Assistant hoon. Website, app, CRM, AI ya SEO ke baare mein pooch sakte hain.'
      : 'Hello! 👋 I\'m the Encogix Assistant. Ask about website development, ecommerce, mobile apps, CRM, AI solutions, SEO, pricing, or contact details.';
  }

  const topic = findTopic(lower);
  if (topic) return hindi && topic.data.hindi ? topic.data.hindi : topic.data.reply;

  return hindi
    ? 'Is query ke liye hamari team jald contact karegi. Call: +91 9431607346 | WhatsApp bhi kar sakte hain.'
    : 'Our team will contact you shortly. Call +91 9431607346 or WhatsApp us for faster response.';
}

module.exports = { KNOWLEDGE, getChatbotReply, findTopic, isHindi };
