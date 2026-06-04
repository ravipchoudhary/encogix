export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Encogix Technology",
    url: "https://www.encogix.com",
    logo: "https://www.encogix.com/logo.svg",
    description:
      "Website development, mobile apps, custom software, CRM, AI chatbots & SEO in Noida, Greater Noida & Delhi NCR.",
    telephone: "+91-9431607346",
    email: "contact@encogix.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gaur City Center, Greater Noida",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201318",
      addressCountry: "IN",
    },
    areaServed: ["Noida", "Greater Noida", "Delhi NCR", "India"],
    priceRange: "₹₹",
    sameAs: [
      "https://www.linkedin.com/company/encogix-technology",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQSchema({ items }: { items: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
