import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("ecommerce-development");

export default function EcommerceDevelopmentPage() {
  return <ServicePageLayout service={SERVICES["ecommerce-development"]} />;
}
