import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Cloud Transformation Services | Encogix Technology",
  description: "Cloud migration, AWS, Azure, GCP, cloud architecture, optimization, managed cloud, DevOps, and security solutions.",
};

const sections = [
  { title: "Cloud Migration", items: ["Assessment of current infrastructure and workloads", "Migration planning for applications, data, and services", "Low-risk migration with minimal downtime", "Hybrid and multi-cloud strategy support"] },
  { title: "AWS", items: ["AWS architecture design and infrastructure setup", "EC2, S3, RDS, Lambda, ECS, EKS support", "Cloud monitoring and scaling strategies", "Secure application deployment on AWS"] },
  { title: "Azure", items: ["Azure infrastructure and application modernization", "App Service, AKS, Azure SQL, storage, and networking", "Enterprise security and identity integration", "Hybrid migration support for existing systems"] },
  { title: "Google Cloud", items: ["GCP cloud migration and deployment planning", "Compute, storage, networking, and managed services", "Data and analytics hosting on GCP", "Cost-optimized architecture and deployment"] },
  { title: "Cloud Architecture", items: ["Scalable AWS/Azure/GCP architecture design", "Resilient and secure multi-tier systems", "Load balancing, autoscaling, and recovery planning", "Performance and cost-aware design decisions"] },
  { title: "Cloud Optimization", items: ["Cost reduction and performance tuning", "Right-sizing infrastructure and workloads", "Monitoring and autoscaling setup", "Improved availability and operational efficiency"] },
  { title: "Managed Cloud", items: ["Cloud operations and performance monitoring", "Patch management and environment governance", "Environment support and incident response", "Ongoing optimization and capacity management"] },
  { title: "Security", items: ["IAM design, access control, and networking hardening", "Data encryption and compliance readiness", "Monitoring, logging, and alert configuration", "Best-practice cloud security implementation"] },
  { title: "DevOps Integration", items: ["CI/CD pipelines for cloud deployment", "Infrastructure as code with Terraform and similar tools", "Containerization and orchestration support", "Release automation and deployment governance"] },
];

const faqs = [
  { question: "Can you migrate our existing app to the cloud safely?", answer: "Yes. We assess your current architecture and create a phased migration plan to reduce risk and downtime." },
  { question: "Do you support AWS, Azure, and GCP?", answer: "Yes. We design and implement solutions across major cloud platforms depending on the business need and architecture fit." },
  { question: "Can cloud migration include DevOps and security?", answer: "Absolutely. We can integrate deployment automation, infrastructure as code, and cloud security controls as part of the transformation." },
];

export default function CloudTransformationPage() {
  return (
    <StructuredPage
      chip="Modernize your infrastructure"
      title="Cloud Transformation"
      subtitle="Move to resilient, scalable, and secure cloud infrastructure with a strategy built for performance, cost, and business continuity."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Plan your cloud migration"
      contactSubtitle="Tell us about your current infrastructure, workloads, and cloud goals so we can define a tailored modernization roadmap."
      ctaTitle="Future-ready your infrastructure"
      ctaDescription="Use cloud transformation to improve agility, scalability, resilience, and operational performance."
    />
  );
}
