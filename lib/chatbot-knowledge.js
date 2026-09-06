const PHONE = '+91 9431607346';
const EMAIL = 'contact@encogix.com';
const ADDRESS = 'Gaur City Center, Greater Noida, Uttar Pradesh, 201318';

const KNOWLEDGE = {
  website: {
    keywords: ['website', 'web development', 'static', 'dynamic', 'business website', 'portfolio', 'corporate', 'landing page', 'web site'],
    reply: 'We build fast, mobile-friendly websites for businesses, portfolios, and landing pages. Packages include responsive design, SEO basics, contact forms, and WhatsApp integration. Standard websites start at ₹15,000 and usually take 2–4 weeks.',
    hindi: 'Hum business, portfolio aur landing page ke liye fast, mobile-friendly websites banate hain. SEO basics, contact form aur WhatsApp integration included hain. Website ₹15,000 se start hoti hai aur 2–4 weeks lagte hain.',
    question: 'Aapko business website, portfolio ya landing page chahiye?',
  },
  ecommerce: {
    keywords: ['ecommerce', 'e-commerce', 'online store', 'online shop', 'shopping website', 'cart', 'checkout', 'payment gateway', 'inventory'],
    reply: 'Our ecommerce solutions include product catalogue, cart, checkout, Razorpay/payment gateway, order management, admin panel, and inventory support. Projects start at ₹75,000 and typically take 4–8 weeks.',
    hindi: 'Ecommerce solution mein product catalogue, cart, checkout, Razorpay/payment gateway, order management, admin panel aur inventory support milta hai. Projects ₹75,000 se start hote hain aur 4–8 weeks lagte hain.',
    question: 'Aapke store mein kitne products aur kaunsa payment gateway chahiye?',
  },
  mobile: {
    keywords: ['mobile app', 'android', 'ios', 'app development', 'hybrid app', 'flutter', 'react native'],
    reply: 'We develop Android, iOS, and cross-platform apps with React Native or Flutter. We can help with planning, UI, APIs, login, payments, notifications, and store launch. Timelines are usually 6–12 weeks.',
    hindi: 'Hum Android, iOS aur cross-platform apps React Native ya Flutter mein banate hain. UI, API, login, payment, notifications aur launch mein help karte hain. Usually 6–12 weeks lagte hain.',
    question: 'Aapka app Android ke liye hai, iOS ke liye, ya dono ke liye?',
  },
  crm: {
    keywords: ['crm', 'erp', 'complaint management', 'lead management', 'custom software', 'business software', 'workflow automation'],
    reply: 'We create custom CRM, ERP, lead tracking, complaint management, and workflow tools with role-based dashboards. Projects start at ₹1,50,000 and usually take 8–16 weeks depending on modules.',
    hindi: 'Hum CRM, ERP, lead tracking, complaint management aur workflow software role-based dashboards ke saath banate hain. Projects ₹1,50,000 se start hote hain aur modules ke hisaab se 8–16 weeks lagte hain.',
    question: 'Aapko leads, employees, billing, inventory ya reports mein se kya manage karna hai?',
  },
  ai: {
    keywords: ['ai', 'artificial intelligence', 'ai chatbot', 'calling agent', 'customer support bot', 'whatsapp bot'],
    reply: 'We build practical AI solutions such as website chatbots, calling agents, WhatsApp bots, lead qualification, and workflow automation. We first understand your process, then suggest the right integration and budget.',
    hindi: 'Hum website chatbot, calling agent, WhatsApp bot, lead qualification aur workflow automation jaise AI solutions banate hain. Pehle aapka process samajhkar sahi integration aur budget suggest karte hain.',
    question: 'Aap AI ko customer support, leads ya internal automation ke liye use karna chahte hain?',
  },
  seo: {
    keywords: ['seo', 'digital marketing', 'google ranking', 'local seo', 'social media', 'whatsapp marketing'],
    reply: 'Our SEO and digital marketing work covers technical SEO, on-page and local SEO, Google Business Profile, social media, and WhatsApp marketing. Monthly plans start at ₹8,000. SEO normally needs 2–3 months for meaningful results.',
    hindi: 'Hum technical SEO, on-page, local SEO, Google Business Profile, social media aur WhatsApp marketing karte hain. Monthly plans ₹8,000 se start hote hain. Meaningful SEO results ke liye usually 2–3 months lagte hain.',
    question: 'Aap local customers target karna chahte hain ya all-India audience?',
  },
  hosting: {
    keywords: ['hosting', 'domain', 'ssl', 'maintenance', 'speed optimization', 'website security'],
    reply: 'We can help with domain, hosting, SSL, backups, security updates, speed optimization, and ongoing maintenance. Maintenance plans start at ₹3,000 per month.',
    hindi: 'Hum domain, hosting, SSL, backup, security updates, speed optimization aur ongoing maintenance mein help karte hain. Maintenance plans ₹3,000 per month se start hote hain.',
    question: 'Kya aapki existing website mein speed, security ya hosting ki problem aa rahi hai?',
  },
  pricing: {
    keywords: ['price', 'pricing', 'cost', 'kitna', 'rate', 'budget', 'package', 'starting price', 'charges'],
    reply: 'Our starting prices are: website ₹15,000, business website ₹35,000, ecommerce ₹75,000, CRM/software ₹1,50,000+, SEO ₹8,000/month, and maintenance ₹3,000/month. Final pricing depends on features, integrations, and timeline. We offer a free initial consultation.',
    hindi: 'Starting price: website ₹15,000, business website ₹35,000, ecommerce ₹75,000, CRM/software ₹1,50,000+, SEO ₹8,000/month aur maintenance ₹3,000/month. Final price features aur integrations par depend karta hai. Initial consultation free hai.',
    question: 'Aap kis type ka project banana chahte hain aur aapka approximate budget kya hai?',
  },
  timeline: {
    keywords: ['timeline', 'how long', 'kitne din', 'duration', 'delivery time', 'weeks', 'kab tak'],
    reply: 'Typical timelines are: website 2–4 weeks, ecommerce 4–8 weeks, mobile app 6–12 weeks, and CRM/software 8–16 weeks. We confirm the exact plan after understanding your features.',
    hindi: 'Typical timeline: website 2–4 weeks, ecommerce 4–8 weeks, mobile app 6–12 weeks aur CRM/software 8–16 weeks. Exact plan features samajhne ke baad confirm hota hai.',
    question: 'Kya aapke paas launch ki koi specific deadline hai?',
  },
  internship: {
    keywords: ['internship', 'intern', 'training', 'fresher', 'student'],
    reply: 'Our internship opportunities cover web development, software development, UI/UX, and digital marketing. Details and applications are available at encogix.com/internship.',
    hindi: 'Internship Web Development, Software Development, UI/UX aur Digital Marketing mein available hai. Details aur application encogix.com/internship par mil jayegi.',
  },
  contact: {
    keywords: ['contact', 'phone number', 'call', 'email', 'address', 'office', 'location', 'noida', 'where are you'],
    reply: `You can reach Encogix at ${PHONE} or ${EMAIL}. Our office is at ${ADDRESS}. We also have an office near BM College, Rahika, Madhubani.`,
    hindi: `Aap Encogix ko ${PHONE} par call ya ${EMAIL} par email kar sakte hain. Office: ${ADDRESS}. Bihar office: BM College ke paas, Rahika, Madhubani.`,
  },
  career: {
    keywords: ['job', 'career', 'hiring', 'vacancy', 'opening', 'recruitment'],
    reply: 'You can see current openings and apply directly at encogix.com/career. Share your profile there so the team can review it.',
    hindi: 'Current jobs encogix.com/career par dekhiye aur directly apply kijiye. Wahi apna profile share karein taaki team review kar sake.',
  },
};

const FOLLOW_UP_EN = {
  website: 'Would you like a business website, portfolio, or landing page?',
  ecommerce: 'How many products will your store have, and which payment gateway do you need?',
  mobile: 'Should your app support Android, iOS, or both?',
  crm: 'Do you need to manage leads, employees, billing, inventory, or reports?',
  ai: 'Would you use AI for customer support, lead generation, or internal automation?',
  seo: 'Are you targeting local customers or an all-India audience?',
  hosting: 'Is your existing website having speed, security, or hosting problems?',
  pricing: 'What kind of project do you have in mind, and what is your approximate budget?',
  timeline: 'Do you have a specific launch deadline?',
};

function isHindi(text) {
  return /[\u0900-\u097F]/.test(text) || /\b(kya|kaise|kitna|hai|hain|chahiye|banwana|banwani|batao|bataiye|karo|karein|mujhe|aapka|aapki|ke liye)\b/i.test(text);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesKeyword(text, keyword) {
  return new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'i').test(text);
}

function findTopic(lower) {
  let best = null;
  for (const [key, data] of Object.entries(KNOWLEDGE)) {
    const matches = data.keywords.filter((keyword) => matchesKeyword(lower, keyword));
    if (matches.length && (!best || matches.length > best.matches.length)) best = { key, data, matches };
  }
  return best;
}

function getChatbotReply(message) {
  const text = String(message || '').trim();
  const lower = text.toLowerCase().replace(/[!?.,;:]+/g, ' ').replace(/\s+/g, ' ');
  const hindi = isHindi(text);

  if (!lower) return hindi ? 'Namaste! Main Encogix Assistant hoon. Aapko kis cheez mein help chahiye?' : 'Welcome to Encogix Technology! What would you like help with today?';
  if (/^(hi|hello|hey|namaste|namaskar|good morning|good afternoon|good evening)\b/.test(lower)) {
    return hindi ? 'Namaste! 👋 Main Encogix Assistant hoon. Website, app, CRM, AI, SEO ya pricing ke baare mein pooch sakte hain.' : 'Hello! 👋 I’m the Encogix Assistant. I can help with websites, apps, CRM, AI, SEO, pricing, or a free project quote.';
  }
  if (/\b(thanks|thank you|thx|dhanyavaad|shukriya)\b/.test(lower)) return hindi ? 'Aapka swagat hai! 😊 Jab bhi zaroorat ho, main yahin hoon.' : 'You’re welcome! 😊 I’m here whenever you need us.';
  if (/\b(help|madad|support|guide|suggest)\b/.test(lower) && !findTopic(lower)) return hindi ? 'Bilkul, main help karta hoon. Aap website, app, CRM, AI, SEO, pricing ya contact ke baare mein pooch sakte hain.' : 'Absolutely, I can help. Ask me about websites, apps, CRM, AI, SEO, pricing, timelines, or contacting our team.';
  if (/\b(quote|quotation|free consultation|discuss|project start|banwana)\b/.test(lower)) return hindi ? 'Zaroor! Free quote ke liye apna naam, phone number aur project ki short details share kijiye. Hamari team aapse 24 hours ke andar contact karegi.' : 'Sure! For a free quote, share your name, phone number, and a short description of the project. Our team will get back to you within 24 hours.';

  const topic = findTopic(lower);
  if (topic) {
    const base = hindi && topic.data.hindi ? topic.data.hindi : topic.data.reply;
    const question = hindi ? topic.data.question : FOLLOW_UP_EN[topic.key];
    return question ? `${base}\n\n${question}` : base;
  }

  return hindi
    ? `Main is sawaal ko samajhne mein help kar sakta hoon. Aap website, app, CRM, AI, SEO ya pricing ke baare mein poochiye. Direct baat ke liye ${PHONE} par call karein.`
    : `I want to help with the right answer. You can ask about website development, apps, CRM, AI, SEO, pricing, or timelines. For a quick conversation, call ${PHONE}.`;
}

module.exports = { KNOWLEDGE, getChatbotReply, findTopic, isHindi };
