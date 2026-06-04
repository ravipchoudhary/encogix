import ServicePageLayout from "../../../components/ServicePageLayout";
import { SERVICES, serviceMetadata } from "../../../lib/services-data";

export const metadata = serviceMetadata("mobile-app-development");

export default function MobileAppDevelopmentPage() {
  return <ServicePageLayout service={SERVICES["mobile-app-development"]} />;
}
