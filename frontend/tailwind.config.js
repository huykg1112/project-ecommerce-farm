/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1600px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#599146",
          foreground: "#ffffff",
          light: "#90c577",
          lighter: "#accc8b",
          dark: "#44703d",
        },
        secondary: {
          DEFAULT: "#74a65d",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "leaf-pattern": "url('/patterns/leaf-bg.svg')",
      },
    },
  },
  safelist: [
    "bg-[#90c577]",
    "bg-[#74a65d]",
    "bg-[#5f8a4b]",
    "bg-[#accc8b]/10",
    "bg-[#accc8b]/20",
    "bg-[#accc8b]/5",
    "border-[#90c577]",
    "border-[#accc8b]/30",
    "text-[#44703d]",
    "text-[#74a65d]",
    "hover:bg-[#90c577]/20",
    "hover:bg-[#accc8b]/20",
    "hover:bg-red-50",
    "text-red-600",
    "data-[state=checked]:bg-[#74a65d]",
    "data-[state=checked]:border-[#74a65d]",
  ],
  plugins: [require("tailwindcss-animate")],
};
