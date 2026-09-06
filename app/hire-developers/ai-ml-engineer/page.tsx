import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire AI/ML Engineer | Encogix Technology",
  description: "Hire AI/ML engineers for predictive analytics, recommendation systems, NLP, computer vision, and intelligent automation projects.",
};

const sections = [
  { title: "Overview", items: ["Design and deploy AI-powered features for products and internal operations", "Use ML and NLP to improve recommendations, search, classification, and automation", "Integrate AI with business workflows, CRM, and customer journeys", "Deliver measurable improvements in speed, insights, and user experience"] },
  { title: "Skills", items: ["Machine learning, NLP, predictive modeling", "TensorFlow, PyTorch, OpenAI APIs, LangChain", "Data preparation, evaluation, and experimentation", "MLOps, model deployment, and monitoring", "AI workflow automation and orchestration"] },
  { title: "Experience Levels", items: ["AI engineer for model validation and integration", "ML engineer for pipelines and experimentation", "Senior ML engineer for architecture and deployment", "AI/ML lead for product strategy and rollout planning"] },
  { title: "Hiring Models", items: ["Dedicated AI/ML engineer", "AI project team", "Proof-of-concept sprint", "Team augmentation for product squads"] },
  { title: "Development Process", items: ["Problem framing and data assessment", "Model design and experimentation", "Prototype validation and integration", "Deployment, monitoring, and iterative improvement"] },
  { title: "Tech Stack", items: ["Python, TensorFlow, PyTorch, OpenAI", "LangChain, scikit-learn, Jupyter", "PostgreSQL, MongoDB, Redis", "Docker, AWS, Azure, CI/CD"] },
  { title: "Industries", items: ["Healthcare analytics", "FinTech risk and fraud", "Retail personalization", "Manufacturing QA", "Customer support automation"] },
];

const faqs = [
  { question: "What kinds of AI solutions do you build?", answer: "We build NLP, forecasting, recommendation engines, predictive models, chatbots, and automation workflows for business operations." },
  { question: "Do you support AI PoCs before full implementation?", answer: "Yes. We can validate feasibility and build a proof-of-concept before moving to production-scale implementation." },
];

export default function HireAiMlEngineerPage() {
  return (
    <StructuredPage
      chip="AI and data science"
      title="Hire AI/ML Engineer"
      subtitle="Bring intelligence into your business with AI specialists who can build, deploy, and optimize modern machine learning solutions."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Plan your AI initiative"
      contactSubtitle="Share the problem you want to solve, your data readiness, and business goals so we can propose the right AI model and delivery plan."
      ctaTitle="Turn AI into business value"
      ctaDescription="Use a focused AI/ML partnership to prototype faster, improve decision-making, and build automated workflows."
    />
  );
}
