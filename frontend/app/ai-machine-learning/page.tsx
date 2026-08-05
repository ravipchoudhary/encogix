import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "AI & Machine Learning Services | Encogix Technology",
  description: "AI solutions, machine learning services, generative AI, chatbot development, automation, NLP, and computer vision for businesses.",
};

const sections = [
  { title: "AI Solutions", items: ["AI-powered customer support and lead qualification", "Intelligent business automation and workflow intelligence", "AI-based recommendation and personalization systems", "Decision support and predictive operations tools"] },
  { title: "Machine Learning Services", items: ["Predictive models for marketing and operations", "Anomaly detection and demand forecasting", "Recommendation engines and scoring systems", "Feature engineering and model validation"] },
  { title: "Generative AI", items: ["Custom generative AI assistants and copilots", "Knowledge-base chat solutions and content generation", "Prompt pipelines and enterprise-ready AI interfaces", "Human-in-the-loop review and governance"] },
  { title: "Chatbot Development", items: ["Website and WhatsApp AI assistants", "Multilingual support for English and Hindi", "Lead capture and CRM synchronization", "Support automation with escalation logic"] },
  { title: "AI Automation", items: ["Workflow automation across business processes", "Document processing and smart data extraction", "Internal knowledge management systems", "Process monitoring and response automation"] },
  { title: "Computer Vision", items: ["Image classification and analysis", "Visual inspection for quality assurance", "Facial and object recognition systems", "Vision-powered operational workflows"] },
  { title: "NLP Solutions", items: ["Sentiment analysis and text classification", "AI summarization and knowledge retrieval", "Intent detection and smart ticket routing", "Multilingual text processing and automation"] },
  { title: "Technologies Used", items: ["Python, TensorFlow, PyTorch, OpenAI APIs", "LangChain, scikit-learn, Jupyter", "PostgreSQL, Redis, MongoDB", "AWS, Azure, Docker, CI/CD"] },
  { title: "Industries", items: ["Healthcare", "Retail", "Finance", "Education", "Manufacturing", "Logistics", "Real estate", "Startups"] },
  { title: "Development Process", items: ["Problem framing and business objective mapping", "Data preparation and feasibility review", "Model development and validation", "Solution deployment, monitoring, and optimization"] },
];

const faqs = [
  { question: "What industries can benefit from AI?", answer: "AI is valuable across healthcare, retail, education, finance, logistics, and operations-heavy businesses needing automation and prediction." },
  { question: "Do you offer AI chatbots only or end-to-end AI systems?", answer: "We support both: AI assistants and broader machine learning systems integrated into business workflows and existing apps." },
  { question: "Can AI be added to an existing product?", answer: "Yes, we can integrate AI capabilities into your current website, CRM, support system, or business tool without a complete rebuild." },
];

export default function AiMachineLearningPage() {
  return (
    <StructuredPage
      chip="Smart automation"
      title="AI & Machine Learning"
      subtitle="Build smarter, faster, and more data-driven business operations with AI systems designed around real outcomes and measurable ROI."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Discuss your AI roadmap"
      contactSubtitle="Tell us your workflow, data, and goals and we’ll help identify where AI can create measurable value."
      ctaTitle="Ready to automate with AI?"
      ctaDescription="Turn AI into an operational advantage with practical solutions built for performance, scale, and business impact."
    />
  );
}
