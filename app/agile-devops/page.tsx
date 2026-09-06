import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Agile & DevOps Services | Encogix Technology",
  description: "CI/CD, Docker, Kubernetes, IaC, automation, monitoring, release management, and agile delivery solutions for modern software teams.",
};

const sections = [
  { title: "CI/CD", items: ["Pipeline design for automated build, test, and deployment", "Continuous integration for fast and reliable delivery", "Environment promotion and release control", "Quality gates for stable deployments"] },
  { title: "Docker", items: ["Containerization of applications and services", "Environment consistency across dev, test, and prod", "Simplified onboarding and deployment management", "Microservice deployment readiness"] },
  { title: "Kubernetes", items: ["Cluster orchestration and service scaling", "Rolling deployments and zero-downtime releases", "Resource optimization and health checks", "Multi-service application management"] },
  { title: "Infrastructure as Code", items: ["Automated environment provisioning and deployment", "Terraform and IaC best practices", "Version-controlled infrastructure workflows", "Repeatable cloud setup across environments"] },
  { title: "Monitoring", items: ["Application and infrastructure monitoring", "Alerts, logs, and health dashboards", "Incident visibility and performance alerts", "Service reliability improvements"] },
  { title: "Automation", items: ["Process automation for repetitive software tasks", "Build, testing, and release automation", "Deployment orchestration and governance", "Ops efficiency and reduced human error"] },
  { title: "Version Control", items: ["Git workflows, branching strategies, reviews", "Repository hygiene and code quality checks", "Collaboration across engineering teams", "Release-ready code management"] },
  { title: "Release Management", items: ["Structured release processes and communications", "Rollback planning and controlled deployments", "Environment management across stages", "Release monitoring and documentation"] },
  { title: "Benefits", items: ["Faster releases and faster feedback loops", "Lower deployment risk and improved uptime", "Better collaboration between dev and ops", "Scalable and repeatable delivery workflows"] },
];

const faqs = [
  { question: "Do you work with existing DevOps setups?", answer: "Yes. We can improve, extend, and optimize your existing CI/CD and infrastructure workflows without forcing a rewrite." },
  { question: "Can DevOps support be added to an existing app team?", answer: "Absolutely. We can augment your current engineering team with continuous delivery, automation, monitoring, and cloud deployment best practices." },
  { question: "Do you handle containerization and orchestration?", answer: "Yes, including Docker, Kubernetes, deployment automation, and scaling strategies for production workloads." },
];

export default function AgileDevOpsPage() {
  return (
    <StructuredPage
      chip="Faster delivery, safer releases"
      title="Agile & DevOps"
      subtitle="Improve software delivery speed and deployment reliability with agile workflows, automation, and DevOps practices built for product teams."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Build a stronger delivery pipeline"
      contactSubtitle="Tell us your current process, deployment pain points, and roadmap goals and we’ll propose a practical DevOps and agile improvement plan."
      ctaTitle="Ship faster, with more confidence"
      ctaDescription="Turn development and operations into a high-velocity, low-risk delivery engine."
    />
  );
}
