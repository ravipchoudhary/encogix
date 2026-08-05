import type { Metadata } from "next";
import StructuredPage from "../../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Hire Flutter Developer | Encogix Technology",
  description: "Hire skilled Flutter developers for cross-platform mobile apps, clean UI, and high-performance business solutions.",
};

const sections = [
  { title: "Overview", items: ["Build cross-platform mobile apps for Android and iOS with a single codebase", "Create polished UI/UX flows with fast performance and clean architecture", "Support consumer apps, internal tools, ecommerce, and service apps", "Move quickly from prototype to production with reusable components"] },
  { title: "Skills", items: ["Flutter, Dart, Material Design, Cupertino widgets", "State management patterns and app architecture", "REST APIs, authentication, push notifications", "Firebase, SQLite, local storage, in-app analytics", "App store deployment and QA support"] },
  { title: "Experience Levels", items: ["Junior Flutter developer for UI implementation and screens", "Mid-level developer for app features and API integration", "Senior Flutter engineer for architecture and enterprise quality", "Flutter team lead for delivery and technical direction"] },
  { title: "Hiring Models", items: ["Dedicated Flutter developer", "Team augmentation", "Project-based builds", "Feature sprint support"] },
  { title: "Development Process", items: ["Product discovery and app flow mapping", "Wireframes and UI implementation", "Feature build and QA cycles", "Deployment, monitoring, and maintenance"] },
  { title: "Tech Stack", items: ["Flutter, Dart, Firebase, REST APIs", "Provider, Bloc, Riverpod", "PostgreSQL, MongoDB", "GitHub, CI/CD, Play Store / App Store release"] },
  { title: "Industries", items: ["Healthcare apps", "Retail and ecommerce", "Education platforms", "Real estate apps", "Business productivity tools"] },
];

const faqs = [
  { question: "Can Flutter support production-grade business apps?", answer: "Yes. Flutter is well-suited for production apps needing strong performance, reusable design, and multi-platform delivery." },
  { question: "Do you help with app store submission?", answer: "Yes. We can support QA, release builds, and app store submission workflows for Android and iOS." },
];

export default function HireFlutterDeveloperPage() {
  return (
    <StructuredPage
      chip="Mobile engineering"
      title="Hire Flutter Developer"
      subtitle="Launch mobile experiences faster with Flutter developers who build clean, scalable, and user-focused apps."
      breadcrumb={[{ label: "Hire Developers", href: "/hire-developers" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Discuss your Flutter app"
      contactSubtitle="Tell us about your app idea, platform needs, and timeline and we’ll match the right developer or squad."
      ctaTitle="Build your mobile app with expert support"
      ctaDescription="Accelerate time-to-market with a dedicated Flutter developer who understands product quality and delivery."
    />
  );
}
