import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      colors: {
        // Continental Bank palette
        navy: {
          DEFAULT: "#07111F",
          50: "#E8EBF0",
          100: "#C5CCD7",
          200: "#9BA6B6",
          300: "#6E7C92",
          400: "#475770",
          500: "#243553",
          600: "#152441",
          700: "#0E1B33",
          800: "#0A1527",
          900: "#07111F",
          950: "#040810",
        },
        ink: {
          DEFAULT: "#0B0D10",
          900: "#0B0D10",
          800: "#111418",
          700: "#181C22",
          600: "#21262E",
        },
        champagne: {
          DEFAULT: "#C8A96A",
          50: "#FBF6EB",
          100: "#F4E8C9",
          200: "#E8D29B",
          300: "#DBBC72",
          400: "#D2B071",
          500: "#C8A96A",
          600: "#B08D4E",
          700: "#8C6E3C",
          800: "#624D29",
          900: "#372C17",
        },
        ivory: {
          DEFAULT: "#F6F1E8",
          50: "#FCFAF5",
          100: "#F6F1E8",
          200: "#EDE3CF",
          300: "#E3D4B5",
          400: "#D8C49B",
        },
        graphite: {
          DEFAULT: "#8A9099",
          50: "#F3F4F5",
          100: "#E4E6E9",
          200: "#C9CDD3",
          300: "#AAB0B9",
          400: "#8A9099",
          500: "#6B727C",
          600: "#525860",
          700: "#3E4248",
          800: "#2A2D31",
          900: "#16181A",
        },
        // Semantic tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3rem, 6vw, 5.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(2.5rem, 4.5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2rem, 3.5vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.625rem, 2.5vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        eyebrow: ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        eyebrow: "0.18em",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "soft-sm": "0 1px 2px rgba(7, 17, 31, 0.04), 0 1px 1px rgba(7, 17, 31, 0.02)",
        soft: "0 4px 12px -2px rgba(7, 17, 31, 0.06), 0 2px 4px -2px rgba(7, 17, 31, 0.04)",
        "soft-lg": "0 12px 32px -8px rgba(7, 17, 31, 0.12), 0 4px 12px -4px rgba(7, 17, 31, 0.06)",
        "soft-xl": "0 24px 56px -12px rgba(7, 17, 31, 0.18), 0 8px 24px -8px rgba(7, 17, 31, 0.08)",
        "inner-soft": "inset 0 1px 0 0 rgba(255, 255, 255, 0.04)",
        "ring-champagne": "0 0 0 1px rgba(200, 169, 106, 0.4)",
      },
      backgroundImage: {
        "gold-line":
          "linear-gradient(90deg, transparent 0%, rgba(200,169,106,0.5) 50%, transparent 100%)",
        "ivory-grain":
          "radial-gradient(circle at 20% 30%, rgba(200,169,106,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(7,17,31,0.03) 0%, transparent 50%)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "shimmer-gold": {
          "0%": { transform: "translateX(-150%) skewX(-12deg)", opacity: "0" },
          "30%": { opacity: "1" },
          "70%": { opacity: "1" },
          "100%": { transform: "translateX(250%) skewX(-12deg)", opacity: "0" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 480ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-slow": "fade-in-slow 800ms ease-out both",
        shimmer: "shimmer 3.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer-gold": "shimmer-gold 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        breathe: "breathe 4.8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
