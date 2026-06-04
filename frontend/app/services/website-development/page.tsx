import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("website-development");

export default function WebsiteDevelopmentPage() {
  return <ServicePageLayout service={SERVICES["website-development"]} />;
}
