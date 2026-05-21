import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "token-base": "var(--bg-base)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        "surface-4": "var(--surface-4)",
        "fg-primary": "var(--text-primary)",
        "fg-secondary": "var(--text-secondary)",
        "fg-tertiary": "var(--text-tertiary)",
        "fg-disabled": "var(--text-disabled)",
        "fg-inverse": "var(--text-inverse)",
        "border-subtle": "var(--border-subtle)",
        "border-default": "var(--border-default)",
        "border-strong": "var(--border-strong)",
        brand: {
          DEFAULT: "var(--brand-primary)",
          secondary: "var(--brand-secondary)",
          "text-on": "var(--brand-text-on)",
        },
        semantic: {
          success: "var(--success)",
          "success-bg": "var(--success-bg)",
          warning: "var(--warning)",
          "warning-bg": "var(--warning-bg)",
          error: "var(--error)",
          "error-bg": "var(--error-bg)",
          info: "var(--info)",
          "info-bg": "var(--info-bg)",
        },
        "app-bg": "rgb(var(--app-bg-rgb) / <alpha-value>)",
        surface: "rgb(var(--surface-rgb) / <alpha-value>)",
        border: "rgb(var(--border-rgb) / <alpha-value>)",
        text: "rgb(var(--text-rgb) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary-rgb) / <alpha-value>)",
        muted: "rgb(var(--muted-rgb) / <alpha-value>)",
        primary: "rgb(var(--accent-rgb) / <alpha-value>)",
        secondary: "rgb(var(--secondary-fill-rgb) / <alpha-value>)",
        parchment: "rgb(var(--app-bg-rgb) / <alpha-value>)",
        "chrome-border": "rgb(var(--border-rgb) / <alpha-value>)",
        "chrome-active": "rgb(var(--text-rgb) / <alpha-value>)",
        "chrome-icon": "rgb(var(--text-secondary-rgb) / <alpha-value>)",
        forest: "rgb(var(--forest-rgb) / <alpha-value>)",
        sage: "rgb(var(--sage-rgb) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent-500-rgb) / <alpha-value>)",
          50: "rgb(var(--accent-50-rgb) / <alpha-value>)",
          100: "rgb(var(--accent-100-rgb) / <alpha-value>)",
          200: "rgb(var(--accent-200-rgb) / <alpha-value>)",
          500: "rgb(var(--accent-500-rgb) / <alpha-value>)",
          700: "rgb(var(--accent-700-rgb) / <alpha-value>)",
          900: "rgb(var(--accent-900-rgb) / <alpha-value>)",
          hover: "rgb(var(--accent-700-rgb) / <alpha-value>)",
          deep: "rgb(var(--accent-900-rgb) / <alpha-value>)",
          soft: "rgb(var(--accent-50-rgb) / <alpha-value>)",
        },
        navbar: "rgb(var(--nav-bg-rgb) / <alpha-value>)",
        ig: {
          900: "rgb(var(--ig-900-rgb) / <alpha-value>)",
          800: "rgb(var(--ig-800-rgb) / <alpha-value>)",
          700: "rgb(var(--ig-700-rgb) / <alpha-value>)",
          600: "rgb(var(--ig-600-rgb) / <alpha-value>)",
        },
        ao: {
          500: "rgb(var(--accent-ring-rgb) / <alpha-value>)",
          600: "rgb(var(--accent-rgb) / <alpha-value>)",
          700: "rgb(var(--accent-hover-rgb) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1200px",
        shell: "var(--page-max-width)",
        page: "var(--page-max-width)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        shell: "28px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      transitionDuration: {
        150: "150ms",
        180: "180ms",
      },
      keyframes: {
        "radix-in": {
          from: { opacity: "0", transform: "scale(0.97) translateY(2px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "radix-out": {
          from: { opacity: "1", transform: "scale(1) translateY(0)" },
          to: { opacity: "0", transform: "scale(0.97) translateY(2px)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
      },
      animation: {
        "radix-in": "radix-in 180ms ease-out forwards",
        "radix-out": "radix-out 150ms ease-in forwards",
        "fade-in": "fade-in 180ms ease-out forwards",
        "fade-out": "fade-out 150ms ease-in forwards",
      },
      backgroundImage: {
        aurora: "linear-gradient(90deg, #FFE2D6 0%, #E9F7F1 50%, #FFF6EC 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
