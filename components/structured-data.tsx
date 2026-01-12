"use client";

import { useEffect } from "react";

interface StructuredDataProps {
  locale: string;
}

export function StructuredData({ locale }: StructuredDataProps) {
  useEffect(() => {
    const baseUrl = "https://fakelumos.vercel.app";
    
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Fake Lumos",
      url: baseUrl,
      logo: `${baseUrl}/images/favicon/android-chrome-512x512.png`,
      description:
        locale === "pt-BR"
          ? "Detector de fake news usando inteligência artificial do Google Gemini"
          : locale === "en"
          ? "Fake news detector using Google Gemini artificial intelligence"
          : "Detector de noticias falsas usando inteligencia artificial de Google Gemini",
      sameAs: [
        "https://fakelumos.vercel.app",
      ],
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Fake Lumos",
      url: baseUrl,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/{search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: locale === "pt-BR" ? "pt-BR" : locale === "en" ? "en" : "es",
    };

    const softwareApplicationSchema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Fake Lumos",
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
      },
      description:
        locale === "pt-BR"
          ? "Ferramenta gratuita para verificação de notícias usando IA"
          : locale === "en"
          ? "Free tool for news verification using AI"
          : "Herramienta gratuita para verificación de noticias usando IA",
    };

    const schemas = [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
    ];

    schemas.forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(schema);
      script.id = `structured-data-${schema["@type"]}`;
      
      // Remove script anterior se existir
      const existing = document.getElementById(script.id);
      if (existing) {
        existing.remove();
      }
      
      document.head.appendChild(script);
    });

    return () => {
      schemas.forEach((schema) => {
        const script = document.getElementById(
          `structured-data-${schema["@type"]}`
        );
        if (script) {
          script.remove();
        }
      });
    };
  }, [locale]);

  return null;
}
