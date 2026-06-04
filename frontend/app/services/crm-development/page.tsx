import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("crm-development");

export default function CrmDevelopmentPage() {
  return <ServicePageLayout service={SERVICES["crm-development"]} />;
}
