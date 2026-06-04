import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("seo-services");

export default function SeoServicesPage() {
  return <ServicePageLayout service={SERVICES["seo-services"]} />;
}
