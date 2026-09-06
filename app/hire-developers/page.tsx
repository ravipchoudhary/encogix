import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Developers | Dedicated Development Teams | Encogix",
  description: "Hire dedicated React, Node.js, Flutter, Python, AI, cloud, and full-stack developers from Encogix for flexible project delivery.",
  alternates: { canonical: "/hire-developers" },
};

const sections = [
  {
    title: "Developer Categories",
    description: "Choose experienced developers across frontend, backend, mobile, cloud, design, and intelligent applications.",
    items: [
      "React, React Native, Next.js, Angular, and Vue developers",
      "Node.js, Express, Python Django/FastAPI, Java, and .NET engineers",
      "Flutter, Dart, iOS, Android, and cross-platform app developers",
      "PHP, Laravel, ecommerce, and business application specialists",
      "DevOps, AWS, Azure, GCP, Docker, and Kubernetes engineers",
      "UI/UX, frontend, AI/ML, data science, and automation experts",
    ],
  },
  {
    title: "Hiring Models",
    description: "Select an engagement model that matches your roadmap, budget, and workload.",
    items: [
      "Full-time dedicated developers for long-term product ownership",
      "Part-time developers for flexible support and changing priorities",
      "Hourly specialists for focused tasks and quick turnarounds",
      "Dedicated development teams for complete product delivery",
      "Team augmentation for extending your existing engineering team",
      "Project-based delivery for clearly defined scopes and milestones",
    ],
  },
  {
    title: "Why Hire from Encogix",
    description: "Get more than a profile. We help you find people who fit your technology, communication, and delivery needs.",
    items: [
      "Technical and communication screening before a developer match",
      "Flexible scaling up or down as your product roadmap changes",
      "Timezone-friendly collaboration with remote and hybrid teams",
      "Project-ready onboarding into your tools, repository, and workflow",
      "Code quality, testing, documentation, and version-control practices",
      "NDA and IP protection for your product, data, and business ideas",
    ],
  },
  {
    title: "Technologies We Cover",
    description: "Build with a practical, modern stack across web, mobile, data, cloud, and AI.",
    items: [
      "React, Next.js, Angular, Vue, Vite, Tailwind CSS, and TypeScript",
      "Node.js, Express, Python, Django, FastAPI, PHP, Java, and .NET",
      "Flutter, React Native, Kotlin, Swift, Android, and iOS",
      "PostgreSQL, MySQL, MongoDB, Firebase, and API integrations",
      "AWS, Azure, GCP, Docker, Kubernetes, CI/CD, and monitoring",
      "OpenAI, LangChain, TensorFlow, PyTorch, and workflow automation",
    ],
  },
  {
    title: "Our Hiring Process",
    description: "A simple and transparent process to get the right developer started quickly.",
    items: [
      "Share your requirements, technical stack, timeline, and budget",
      "Receive curated developer profiles matched to your needs",
      "Interview candidates and complete technical validation",
      "Choose the right developer, specialist, or delivery team",
      "Sign the NDA and connect your tools and development workflow",
      "Start delivery with sprint reviews, reporting, and ongoing support",
    ],
  },
  {
    title: "Optional Add-on Support",
    description: "Add the extra delivery support your project needs without building another department.",
    items: [
      "Project managers for planning, communication, and delivery tracking",
      "QA and test engineers for functional, API, and regression testing",
      "Code audits and architecture reviews for existing applications",
      "Deployment, CI/CD, cloud migration, and infrastructure support",
      "UI/UX design, design systems, and frontend implementation",
      "Performance optimization, security reviews, and maintenance",
    ],
  },
];

const faqs = [
  { question: "How quickly can I hire a developer from Encogix?", answer: "We usually share suitable developer profiles within 24 hours. The exact start date depends on the skill set, interview process, and project scope." },
  { question: "Can I hire one developer instead of a complete team?", answer: "Yes. You can hire one specialist, a small product squad, or add QA, DevOps, design, and project management support as needed." },
  { question: "Can I scale the team later?", answer: "Yes. Our flexible engagement model supports scaling up or down as your roadmap and workload change." },
  { question: "Do you support remote and hybrid collaboration?", answer: "Yes. Our developers can work with your existing tools, team rituals, repositories, and remote or hybrid delivery process." },
];

export default function HireDevelopersPage() {
  return (
    <StructuredPage
      chip="Dedicated engineering teams"
      title="Hire Developers"
      subtitle="Build faster with experienced developers who can contribute from day one. Hire a specialist, a dedicated developer, or a complete delivery team for your product roadmap."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      quickActions={[
        { label: "Request a Developer", href: "/contact" },
        { label: "View Developer Roles", href: "/hire-developers/full-stack-developer", variant: "outline" },
      ]}
      sections={sections}
      faqs={faqs}
      contactTitle="Need a custom developer team?"
      contactSubtitle="Share your stack, timeline, and hiring goals. Our team will recommend the best-fit developer or engagement model."
      ctaTitle="Start building with the right developer"
      ctaDescription="Get matched with a developer or team for your roadmap, product, and budget through a fast, transparent process."
    />
  );
}
