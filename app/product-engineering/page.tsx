import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Product Engineering Services | Encogix Technology",
  description: "Product strategy, MVP development, product design, software engineering, scaling, maintenance, QA, and product lifecycle support.",
};

const sections = [
  { title: "Product Strategy", items: ["Roadmap planning and product discovery workshops", "Feature prioritization and stakeholder alignment", "Business validation and technical feasibility reviews", "Go-to-market planning for digital products"] },
  { title: "MVP Development", items: ["Rapid MVP builds to validate ideas quickly", "Lean product architecture and essential features", "User testing and iteration support", "Launch-ready builds for startup teams"] },
  { title: "Product Design", items: ["UX planning, user journeys, and wireframes", "Interface design consistent with business goals", "Responsive and conversion-ready experiences", "Design handoff for smooth engineering execution"] },
  { title: "Software Engineering", items: ["Web, mobile, backend, and cloud implementation", "Modular, scalable architecture for long-term product growth", "Integration with APIs, payment systems, analytics, and tools", "Clean codebase practices and maintainability"] },
  { title: "Scaling Products", items: ["Feature scaling based on product performance", "Architecture improvements for growth and stability", "User analytics and continuous optimization", "Operational support as adoption grows"] },
  { title: "Product Maintenance", items: ["Ongoing bug fixes and feature improvements", "Support for evolving business requirements", "Performance and security monitoring", "Roadmap-based iteration planning"] },
  { title: "QA Testing", items: ["Manual and automated functional testing", "Cross-browser and responsive testing", "Regression and release validation", "User acceptance support for product readiness"] },
  { title: "Product Lifecycle", items: ["Idea validation to launch and scale", "Continuous product refresh and innovation", "Lifecycle tracking and technology updates", "Support for new business requirements over time"] },
];

const faqs = [
  { question: "Do you work with startups and product teams?", answer: "Yes. We help startups validate ideas quickly and support existing teams through MVP, scale-up, and ongoing product maintenance stages." },
  { question: "Can you help with both design and engineering?", answer: "Yes. We can support product discovery, UX design, frontend/backend engineering, testing, and iterative release support." },
  { question: "Do you support long-term product ownership?", answer: "Yes. We can act as a product engineering partner for ongoing maintenance, feature development, and platform evolution." },
];

export default function ProductEngineeringPage() {
  return (
    <StructuredPage
      chip="From idea to product"
      title="Product Engineering"
      subtitle="Build, scale, and evolve digital products with a team focused on user needs, engineering quality, and long-term business growth."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Design your next product roadmap"
      contactSubtitle="Tell us your idea, the current pain points, and the business outcomes you want to achieve and we’ll recommend a practical product approach."
      ctaTitle="Turn ideas into product momentum"
      ctaDescription="From MVP to scaling product features, we help your roadmap move from concept to measurable business value."
    />
  );
}
