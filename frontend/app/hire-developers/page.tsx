import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Developers | Dedicated Development Teams | Encogix",
  description: "Hire dedicated developers from Encogix for React, Next.js, Node.js, Flutter, Python, AI, and full stack projects.",
};

const sectionData = [
  {
    title: "Why Hire from Encogix",
    description: "Scale your team with experienced engineers who understand product delivery, business logic, and user experience.",
    items: [
      "Dedicated developers with product-first thinking",
      "Flexible hiring options for startups, SMEs, and enterprises",
      "Strong communication and agile delivery culture",
      "Focus on code quality, ownership, and measurable outcomes",
      "Cross-functional support across design, QA, deployment, and maintenance",
    ],
  },
  {
    title: "Engagement Models",
    description: "Choose the hiring model that matches your roadmap, budget, and availability.",
    items: [
      "Dedicated Development Team",
      "Time & Material Model",
      "Fixed Scope Delivery",
      "Team Augmentation",
      "Project-based Outsourcing",
      "Part-time/Hourly Expertise",
    ],
  },
  {
    title: "Hiring Process",
    description: "A simple, transparent process to onboard the right developers quickly.",
    items: [
      "Requirements and technical discovery call",
      "Candidate shortlisting based on skill and domain fit",
      "Interview and technical validation",
      "Onboarding with your preferred tools and workflow",
      "Delivery tracking and sprint reviews",
      "Scaled hiring as your product grows",
    ],
  },
  {
    title: "Technologies We Cover",
    description: "Build on the latest stacks with engineering depth across frontend, backend, mobile, cloud, and AI.",
    items: [
      "React, Next.js, Angular, Vue",
      "Node.js, Python, PHP, .NET",
      "Flutter, React Native, Kotlin, Swift",
      "PostgreSQL, MySQL, MongoDB, Firebase",
      "AWS, Azure, GCP, Docker, Kubernetes",
      "OpenAI, LangChain, TensorFlow, PyTorch",
    ],
  },
  {
    title: "Benefits",
    description: "Get offshore and onshore talent advantages without sacrificing quality or agility.",
    items: [
      "Faster time to hire and delivery",
      "Reduced hiring overhead and recruitment costs",
      "Access to niche technical expertise",
      "Flexible scaling for project demands",
      "Clear sprint reporting and milestone visibility",
      "Long-term product partner mindset",
    ],
  },
];

const faqs = [
  { question: "How quickly can I hire a developer from Encogix?", answer: "Most teams can start within 3 to 10 business days depending on the skill set and project scope." },
  { question: "Do you offer dedicated developers only or also complete teams?", answer: "We offer both individual developers and dedicated teams including frontend, backend, QA, DevOps, and product managers." },
  { question: "Can I scale the team later?", answer: "Yes, our flexible engagement model supports scaling up or down as your roadmap changes." },
  { question: "Do you support remote and hybrid collaboration?", answer: "Yes, our developers work smoothly with remote, hybrid, and in-house project workflows through tools like Slack, Jira, GitHub, and Figma." },
];

export default function HireDevelopersPage() {
  return (
    <StructuredPage
      chip="Dedicated engineering teams"
      title="Hire Developers"
      subtitle="Build faster with experienced engineers who can contribute from day one. Whether you need a single specialist or a full cross-functional delivery team, we help you scale with confidence."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      quickActions={[
        { label: "Hire React Developer", href: "/hire-developers/react-developer" },
        { label: "Hire Full Stack Developer", href: "/hire-developers/full-stack-developer" },
      ]}
      sections={sectionData}
      faqs={faqs}
      contactTitle="Need a custom developer team?"
      contactSubtitle="Share your stack, timeline, and hiring goals and we’ll recommend the best-fit developer engagement model."
      ctaTitle="Start building with the right engineering team"
      ctaDescription="Get a matched developer or team for your roadmap, product, and budget in a fast, transparent process."
    />
  );
}
