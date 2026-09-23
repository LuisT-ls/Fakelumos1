import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      // A hidratação de preferências do localStorage e a sincronização com o
      // DOM são efeitos intencionais neste aplicativo.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
