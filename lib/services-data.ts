import type { Metadata } from "next";

export interface ServicePageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  intro: string;
  features: string[];
  deliverables: string[];
  pricingFrom: string;
  timeline: string;
  faqs: { question: string; answer: string }[];
  icon: string;
}

export const SERVICES: Record<string, ServicePageData> = {
  "website-development": {
    slug: "website-development",
    title: "Website Development",
    metaTitle: "Website Development Company in Noida | Encogix Technology",
    metaDescription: "Professional website development in Noida & Delhi NCR. Static, dynamic, business, portfolio & corporate websites. Mobile-friendly, SEO-ready. From ₹15,000.",
    heroSubtitle: "Static · Dynamic · Business · Portfolio · Corporate · Landing Pages",
    intro: "Encogix Technology builds high-converting, mobile-responsive websites for businesses in Noida, Greater Noida & Delhi NCR. From simple static sites to dynamic business platforms with admin panels — we deliver fast, secure, SEO-friendly websites that generate leads.",
    features: ["Static & dynamic websites", "Business & corporate sites", "Portfolio & landing pages", "Mobile-first responsive design", "SEO-friendly structure", "WhatsApp & contact integration", "Admin panel (optional)", "Fast loading & SSL"],
    deliverables: ["Custom UI design", "Responsive frontend", "Contact & lead forms", "Google Analytics setup", "Basic on-page SEO", "1 month free support"],
    pricingFrom: "₹15,000",
    timeline: "2–4 weeks",
    icon: "globe",
    faqs: [
      { question: "How much does a business website cost?", answer: "Business websites start from ₹15,000 for static sites and ₹35,000 for dynamic sites with CMS/admin features." },
      { question: "Do you provide website development in Noida?", answer: "Yes, we are based in Greater Noida and serve clients across Noida, Delhi NCR and pan-India." },
    ],
  },
  "ecommerce-development": {
    slug: "ecommerce-development",
    title: "Ecommerce Website Development",
    metaTitle: "Ecommerce Website Development in Noida | Encogix Technology",
    metaDescription: "Ecommerce website development with cart, checkout, Razorpay payment gateway, order & inventory management. Noida & Delhi NCR. From ₹75,000.",
    heroSubtitle: "Online Store · Cart · Checkout · Payments · Admin Panel",
    intro: "Launch your online store with Encogix. We build full ecommerce platforms with product catalog, shopping cart, secure checkout, payment gateway integration, order management, and admin dashboard — optimized for conversions.",
    features: ["Product listing & categories", "Shopping cart & checkout", "Razorpay payment gateway", "Order management system", "Inventory management", "Customer accounts", "Admin dashboard", "Mobile ecommerce UX"],
    deliverables: ["Ecommerce UI/UX", "Product & category management", "Payment integration", "Order tracking", "Admin panel", "SEO for product pages"],
    pricingFrom: "₹75,000",
    timeline: "4–8 weeks",
    icon: "cart",
    faqs: [
      { question: "Which payment gateways do you integrate?", answer: "We integrate Razorpay, PayU, and other popular Indian payment gateways." },
      { question: "Can I manage products myself?", answer: "Yes, we provide an admin panel to add, edit, and manage products, orders, and inventory." },
    ],
  },
  "mobile-app-development": {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    metaTitle: "Mobile App Development Company in Noida | Encogix Technology",
    metaDescription: "Android, iOS & hybrid mobile app development in Noida. Ecommerce, real estate & business apps. React Native & Flutter experts.",
    heroSubtitle: "Android · iOS · Hybrid · React Native · Flutter",
    intro: "Build powerful mobile apps for Android and iOS with Encogix Technology. We develop native and cross-platform apps for ecommerce, real estate, healthcare, education, and business operations.",
    features: ["Android app development", "iOS app development", "Hybrid/cross-platform apps", "Real estate apps", "Ecommerce mobile apps", "Business & internal apps", "Push notifications", "API integration"],
    deliverables: ["UI/UX design", "App development", "Backend API", "Testing & QA", "Play Store / App Store support", "Post-launch maintenance"],
    pricingFrom: "Custom quote",
    timeline: "6–12 weeks",
    icon: "mobile",
    faqs: [
      { question: "Do you build both Android and iOS apps?", answer: "Yes, we build native Android/iOS apps and cross-platform apps with React Native or Flutter." },
      { question: "Will you help publish on Play Store?", answer: "Yes, we assist with Play Store and App Store submission." },
    ],
  },
  "crm-development": {
    slug: "crm-development",
    title: "CRM & Custom Software Development",
    metaTitle: "CRM Software Development in Noida | Encogix Technology",
    metaDescription: "Custom CRM, ERP, complaint management & lead management software in Noida. Role-based dashboards, automation & integrations.",
    heroSubtitle: "CRM · ERP · Complaint Management · Lead Tracking",
    intro: "Streamline your business with custom CRM and software solutions. Encogix builds lead management systems, complaint management software, ERP modules, and business automation tools tailored to your workflow.",
    features: ["Custom CRM development", "Lead management system", "Complaint management software", "ERP modules", "Role-based access control", "Reports & analytics", "WhatsApp & email integration", "Workflow automation"],
    deliverables: ["Requirement analysis", "Custom dashboard", "User roles & permissions", "Lead/inquiry tracking", "Reports export", "Training & documentation"],
    pricingFrom: "₹1,50,000",
    timeline: "8–16 weeks",
    icon: "crm",
    faqs: [
      { question: "Can CRM be integrated with our website?", answer: "Yes, we integrate CRM with your website forms, WhatsApp, and other lead sources." },
      { question: "Do employees get separate login?", answer: "Yes, role-based access lets admins assign leads and employees update status." },
    ],
  },
  "ai-solutions": {
    slug: "ai-solutions",
    title: "AI Solutions",
    metaTitle: "AI Chatbot & Automation Solutions | Encogix Technology Noida",
    metaDescription: "AI chatbot, AI calling agent, lead generation bot & workflow automation for businesses in Noida & India.",
    heroSubtitle: "AI Chatbot · Calling Agent · Lead Bot · Automation",
    intro: "Automate customer support and lead generation with Encogix AI solutions. We build AI chatbots, AI calling agents, WhatsApp bots, and intelligent workflow automation for websites and businesses.",
    features: ["AI website chatbot", "WhatsApp AI chatbot", "AI calling agent", "Customer support bot", "Lead generation bot", "Workflow automation", "CRM integration", "Multi-language support (Hindi/English)"],
    deliverables: ["Bot design & training", "Knowledge base setup", "Website/WhatsApp integration", "Lead capture flow", "Analytics dashboard", "Ongoing tuning"],
    pricingFrom: "Custom quote",
    timeline: "2–6 weeks",
    icon: "ai",
    faqs: [
      { question: "Can the chatbot answer in Hindi?", answer: "Yes, our AI chatbots support Hindi, English, and Hinglish based on user messages." },
      { question: "Does it capture leads?", answer: "Yes, bots capture name, phone, service interest, and budget, and sync to your CRM." },
    ],
  },
  "seo-services": {
    slug: "seo-services",
    title: "SEO & Digital Marketing",
    metaTitle: "SEO Services in Noida | Local SEO & Digital Marketing | Encogix",
    metaDescription: "SEO services in Noida: on-page, off-page, technical & local SEO. Google Business Profile, social media & WhatsApp marketing. From ₹8,000/month.",
    heroSubtitle: "On-Page · Off-Page · Local SEO · Google Business · Social Media",
    intro: "Rank higher on Google and grow your business with Encogix SEO & digital marketing. We specialize in local SEO for Noida, Greater Noida & Delhi NCR, plus technical SEO, content strategy, and paid campaigns.",
    features: ["On-page SEO optimization", "Off-page & link building", "Technical SEO audit", "Local SEO (Noida/NCR)", "Google Business Profile", "Social media marketing", "WhatsApp Marketing API", "Monthly performance reports"],
    deliverables: ["SEO audit report", "Keyword research", "On-page optimization", "Google Business setup", "Monthly ranking report", "Content recommendations"],
    pricingFrom: "₹8,000/month",
    timeline: "Results in 2–3 months",
    icon: "seo",
    faqs: [
      { question: "Do you provide local SEO for Noida businesses?", answer: "Yes, local SEO for Noida, Greater Noida, and Delhi NCR is one of our core specialties." },
      { question: "How long before SEO results?", answer: "Typically 2–3 months for noticeable improvements; competitive keywords may take longer." },
    ],
  },
};

export function serviceMetadata(slug: string): Metadata {
  const s = SERVICES[slug];
  if (!s) return {};
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    openGraph: { title: s.metaTitle, description: s.metaDescription },
  };
}
