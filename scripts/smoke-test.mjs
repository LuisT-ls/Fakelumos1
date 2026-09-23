const baseUrl = (process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

const pageResponse = await fetch(`${baseUrl}/pt-BR`);
if (!pageResponse.ok) {
  throw new Error(`Página principal retornou HTTP ${pageResponse.status}`);
}

const requiredHeaders = [
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
];

for (const header of requiredHeaders) {
  if (!pageResponse.headers.get(header)) {
    throw new Error(`Header de segurança ausente: ${header}`);
  }
}

const blockedOriginResponse = await fetch(`${baseUrl}/api/verify`, {
  method: "POST",
  headers: {
    origin: "https://evil.example",
    "content-type": "application/json",
  },
  body: JSON.stringify({
    content: "A Terra orbita o Sol.",
    locale: "pt-BR",
  }),
});

if (blockedOriginResponse.status !== 403) {
  throw new Error(
    `Origem externa não foi bloqueada: HTTP ${blockedOriginResponse.status}`
  );
}

console.log(`Smoke test passou: ${baseUrl}`);
