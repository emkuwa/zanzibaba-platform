const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zanzibaba.com"

export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Zanzibaba",
    url: baseUrl,
    description: "Zanzibar's premier building and development marketplace connecting suppliers, contractors, and buyers.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/marketplace?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zanzibaba",
    url: baseUrl,
    description: "Building and development marketplace for Zanzibar and East Africa.",
    foundingDate: "2025",
    areaServed: ["Tanzania", "Zanzibar", "East Africa"],
    knowsAbout: ["Construction", "Building Materials", "Architecture", "Engineering", "Hospitality"],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
