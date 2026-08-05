import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Python Developer | Encogix Technology",
  description: "Hire Python developers for backend systems, automation, analytics, AI integrations, and scalable product engineering.",
};

const sections = [
  { title: "Overview", items: ["Build scalable Python-based backend services and automation workflows", "Support AI, data processing, and analytics-driven business solutions", "Integrate with APIs, databases, and cloud infrastructure", "Create maintainable systems for startups and enterprise teams"] },
  { title: "Skills", items: ["Python, Django, Flask, FastAPI", "Data processing, automation, scripting", "API development and integrations", "PostgreSQL, MongoDB, Redis", "AI/ML integrations and analytics pipelines"] },
  { title: "Experience Levels", items: ["Junior Python developer for automation and scripts", "Mid-level developer for APIs and data modules", "Senior Python engineer for platform design and scale", "Lead engineer for system architecture and team support"] },
  { title: "Hiring Models", items: ["Dedicated Python developer", "Team augmentation", "Fixed-scope backend build", "Data and automation project support"] },
  { title: "Development Process", items: ["Requirements and technical discovery", "Architecture and sprint planning", "Build, test, integrate, and deploy", "Monitoring, optimization, and iteration"] },
  { title: "Tech Stack", items: ["Python, Django, Flask, FastAPI", "PostgreSQL, MongoDB, Redis, Celery", "AWS, Azure, Docker", "GitHub, CI/CD, monitoring and logging tools"] },
  { title: "Industries", items: ["Healthcare", "Logistics", "FinTech", "Analytics platforms", "Operations automation and reporting"] },
];

const faqs = [
  { question: "Is Python a good fit for AI and data work?", answer: "Yes. Python is widely used for AI/ML pipelines, automation, data analysis, and backend services thanks to its ecosystem and speed." },
  { question: "Do you build full Python backend systems?", answer: "Yes, from APIs and business logic to cloud deployment, monitoring, and maintenance." },
];

export default function HirePythonDeveloperPage() {
  return (
    <StructuredPage
      chip="Data and automation"
      title="Hire Python Developer"
      subtitle="Use Python expertise to build automation, analytics, and backend platforms that move your business forward."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Need Python expertise for your project?"
      contactSubtitle="Share your stack, timeline, and technical requirements and we’ll suggest the right developer model."
      ctaTitle="Add Python capability to your team"
      ctaDescription="Accelerate data processing, AI integration, and backend delivery with experienced Python engineers."
    />
  );
}
