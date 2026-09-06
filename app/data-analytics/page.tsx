import type { Metadata } from "next";
import StructuredPage from "../../components/StructuredPage";

export const metadata: Metadata = {
  title: "Data Analytics Services | Encogix Technology",
  description: "Business intelligence, dashboard development, predictive analytics, data warehousing, reporting, and data visualization solutions.",
};

const sections = [
  { title: "Business Intelligence", items: ["End-to-end BI dashboards aligned to leadership KPIs", "Operational reporting for sales, finance, and marketing", "Data consolidation across tools and departments", "Performance scoring and business insights"] },
  { title: "Dashboard Development", items: ["Executive dashboards for daily and monthly reporting", "Real-time KPI tracking with role-based views", "Custom filters, drill-downs, and trend analysis", "Mobile-friendly dashboards for leadership teams"] },
  { title: "Data Visualization", items: ["Charts, heatmaps, geospatial insights, and trend-based visuals", "User-friendly data storytelling for stakeholders", "Conversion and funnel tracking visualization", "Interactive dashboards for data-heavy teams"] },
  { title: "Predictive Analytics", items: ["Demand forecasting and churn analysis", "Sales projections and lead scoring", "Risk analysis and anomaly detection", "Operational forecasting for planning teams"] },
  { title: "Big Data", items: ["Scalable pipelines for large data sets", "Data ingestion and transformation pipelines", "Structured and unstructured data strategy", "Support for operational and analytical workloads"] },
  { title: "Data Warehousing", items: ["Warehouse design and data model planning", "Centralized storage for analytics workloads", "Reporting layer creation for multi-source data", "Security, retention, and performance optimization"] },
  { title: "Reporting Solutions", items: ["Daily, weekly, and monthly automated reports", "Export-ready reporting in business-friendly formats", "Stakeholder-specific views and scheduled delivery", "Alerting and threshold reporting"] },
  { title: "Technologies", items: ["Power BI, Tableau, SQL, Python", "PostgreSQL, MySQL, MongoDB", "BigQuery, Snowflake, ETL workflows", "AWS, Azure, GCP, data pipelines"] },
  { title: "Industries", items: ["Retail", "Healthcare", "Education", "Logistics", "Manufacturing", "FinTech", "Startups", "Real estate"] },
];

const faqs = [
  { question: "How do you start a data analytics project?", answer: "We begin with your KPIs, current reporting challenges, and data sources so we can define the right reporting and dashboard architecture." },
  { question: "Can you improve reporting without changing our systems?", answer: "Yes. We can build dashboards and analytics layers on top of your existing tools and data sources to improve visibility without a disruptive migration." },
  { question: "Do you support custom dashboards?", answer: "Yes, we design stakeholder-specific dashboards with relevant metrics, charts, filters, and alerts." },
];

export default function DataAnalyticsPage() {
  return (
    <StructuredPage
      chip="Insights that drive decisions"
      title="Data Analytics"
      subtitle="Turn scattered business data into insights, dashboards, and decisions that improve performance across teams and operations."
      breadcrumb={[{ label: "Services", href: "/services" }]}
      sections={sections}
      faqs={faqs}
      contactTitle="Need better business visibility?"
      contactSubtitle="Tell us what data you are collecting and which decisions need more clarity, and we’ll design a practical analytics roadmap."
      ctaTitle="Make smarter decisions with data"
      ctaDescription="From KPI dashboards to predictive models, we help you unlock business value from your data."
    />
  );
}
