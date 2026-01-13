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
      featureList: [
        locale === "pt-BR"
          ? "Verificação de fake news com IA"
          : locale === "en"
          ? "Fake news verification with AI"
          : "Verificación de fake news con IA",
        locale === "pt-BR"
          ? "Análise detalhada de notícias"
          : locale === "en"
          ? "Detailed news analysis"
          : "Análisis detallado de noticias",
        locale === "pt-BR"
          ? "Score de confiabilidade"
          : locale === "en"
          ? "Reliability score"
          : "Puntuación de confiabilidad",
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "150",
      },
    };

    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name:
        locale === "pt-BR"
          ? "Verificador de Fake News"
          : locale === "en"
          ? "Fake News Verifier"
          : "Verificador de Fake News",
      description:
        locale === "pt-BR"
          ? "Serviço gratuito de verificação de fake news usando inteligência artificial do Google Gemini"
          : locale === "en"
          ? "Free fake news verification service using Google Gemini artificial intelligence"
          : "Servicio gratuito de verificación de fake news usando inteligencia artificial de Google Gemini",
      provider: {
        "@type": "Organization",
        name: "Fake Lumos",
        url: baseUrl,
      },
      areaServed: {
        "@type": "Country",
        name: locale === "pt-BR" ? "Brasil" : locale === "en" ? "Worldwide" : "Mundial",
      },
      serviceType: "Fact Checking Service",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
      },
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name:
            locale === "pt-BR"
              ? "Como funciona o verificador de fake news?"
              : locale === "en"
              ? "How does the fake news verifier work?"
              : "¿Cómo funciona el verificador de fake news?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              locale === "pt-BR"
                ? "O verificador de fake news usa inteligência artificial do Google Gemini para analisar o conteúdo da notícia, verificar fatos conhecidos e identificar padrões de desinformação, fornecendo um score de confiabilidade e análise detalhada."
                : locale === "en"
                ? "The fake news verifier uses Google Gemini artificial intelligence to analyze news content, verify known facts, and identify disinformation patterns, providing a reliability score and detailed analysis."
                : "El verificador de fake news usa inteligencia artificial de Google Gemini para analizar el contenido de la noticia, verificar hechos conocidos e identificar patrones de desinformación, proporcionando una puntuación de confiabilidad y análisis detallado.",
          },
        },
        {
          "@type": "Question",
          name:
            locale === "pt-BR"
              ? "O verificador de fake news é gratuito?"
              : locale === "en"
              ? "Is the fake news verifier free?"
              : "¿El verificador de fake news es gratuito?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              locale === "pt-BR"
                ? "Sim, o verificador de fake news é completamente gratuito. Você pode verificar quantas notícias quiser sem custo algum."
                : locale === "en"
                ? "Yes, the fake news verifier is completely free. You can verify as many news items as you want at no cost."
                : "Sí, el verificador de fake news es completamente gratuito. Puedes verificar tantas noticias como quieras sin costo.",
          },
        },
        {
          "@type": "Question",
          name:
            locale === "pt-BR"
              ? "Quão preciso é o detector de fake news?"
              : locale === "en"
              ? "How accurate is the fake news detector?"
              : "¿Qué tan preciso es el detector de fake news?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              locale === "pt-BR"
                ? "O detector usa inteligência artificial avançada do Google Gemini, que analisa múltiplos fatores incluindo fontes, padrões de linguagem e fatos verificáveis. A precisão varia, mas recomendamos sempre verificar informações críticas através de múltiplas fontes confiáveis."
                : locale === "en"
                ? "The detector uses advanced artificial intelligence from Google Gemini, which analyzes multiple factors including sources, language patterns, and verifiable facts. Accuracy varies, but we always recommend verifying critical information through multiple reliable sources."
                : "El detector usa inteligencia artificial avanzada de Google Gemini, que analiza múltiples factores incluyendo fuentes, patrones de lenguaje y hechos verificables. La precisión varía, pero siempre recomendamos verificar información crítica a través de múltiples fuentes confiables.",
          },
        },
      ],
    };

    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name:
        locale === "pt-BR"
          ? "Como verificar fake news"
          : locale === "en"
          ? "How to verify fake news"
          : "Cómo verificar fake news",
      description:
        locale === "pt-BR"
          ? "Aprenda a usar o verificador de fake news para verificar a veracidade de notícias"
          : locale === "en"
          ? "Learn how to use the fake news verifier to check news veracity"
          : "Aprende a usar el verificador de fake news para verificar la veracidad de las noticias",
      step: [
        {
          "@type": "HowToStep",
          name:
            locale === "pt-BR"
              ? "Cole ou digite a notícia"
              : locale === "en"
              ? "Paste or type the news"
              : "Pega o escribe la noticia",
          text:
            locale === "pt-BR"
              ? "Cole ou digite o texto da notícia que deseja verificar no campo de texto"
              : locale === "en"
              ? "Paste or type the news text you want to verify in the text field"
              : "Pega o escribe el texto de la noticia que deseas verificar en el campo de texto",
        },
        {
          "@type": "HowToStep",
          name:
            locale === "pt-BR"
              ? "Clique em Verificar"
              : locale === "en"
              ? "Click Verify"
              : "Haz clic en Verificar",
          text:
            locale === "pt-BR"
              ? "Clique no botão 'Verificar Agora' para iniciar a análise"
              : locale === "en"
              ? "Click the 'Verify Now' button to start the analysis"
              : "Haz clic en el botón 'Verificar Ahora' para iniciar el análisis",
        },
        {
          "@type": "HowToStep",
          name:
            locale === "pt-BR"
              ? "Analise os resultados"
              : locale === "en"
              ? "Analyze the results"
              : "Analiza los resultados",
          text:
            locale === "pt-BR"
              ? "Revise o score de confiabilidade, classificação e análise detalhada fornecidos pelo sistema"
              : locale === "en"
              ? "Review the reliability score, classification, and detailed analysis provided by the system"
              : "Revisa la puntuación de confiabilidad, clasificación y análisis detallado proporcionados por el sistema",
        },
      ],
    };

    const schemas = [
      organizationSchema,
      websiteSchema,
      softwareApplicationSchema,
      serviceSchema,
      faqSchema,
      howToSchema,
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
