import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("ai-solutions");

export default function AiSolutionsPage() {
  return <ServicePageLayout service={SERVICES["ai-solutions"]} />;
}
