export function LocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.encogix.com";
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/logo.png`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": `${siteUrl}/#business`,
    name: "Encogix Technology",
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    description:
      "Website development, mobile apps, custom software, CRM, AI chatbots & SEO in Noida, Greater Noida & Delhi NCR.",
    telephone: "+91-9431607346",
    email: "contact@encogix.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "T3, NX ONE, Greater Noida West",
      addressLocality: "Greater Noida West",
      addressRegion: "Uttar Pradesh",
      postalCode: "201318",
      addressCountry: "IN",
    },
    areaServed: ["Noida", "Greater Noida", "Delhi NCR", "India"],
    priceRange: "₹₹",
    sameAs: ["https://www.linkedin.com/company/encogix-technology"],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Encogix Technology",
        publisher: { "@id": `${siteUrl}/#business` },
        inLanguage: "en-IN",
      },
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

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.encogix.com";
  const absoluteUrl = (url: string) => url.startsWith("http") ? url : `${siteUrl.replace(/\/$/, "")}${url || "/"}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export function ServiceSchema({ name, description, url }: { name: string; description: string; url: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.encogix.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: `${siteUrl.replace(/\/$/, "")}${url}`,
    provider: { "@type": "Organization", name: "Encogix Technology", url: siteUrl },
    areaServed: ["Noida", "Greater Noida", "Delhi NCR", "India"],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
