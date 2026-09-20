import type { Config } from "tailwindcss";

// Tailwind v4 is configured in CSS (see src/app/globals.css: @theme).
// This file is kept only so tooling that expects a config file keeps working.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
