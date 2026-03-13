/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        secondary: "#2563eb",
        accent: "#38bdf8",
        background: "#fafbff"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        "soft": "0 4px 24px -4px rgb(15 23 42 / 0.08)",
        "card": "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 10px 20px -5px rgb(15 23 42 / 0.08)",
        "card-hover": "0 20px 40px -10px rgb(15 23 42 / 0.15)",
        "glow": "0 0 40px -8px rgba(37, 99, 235, 0.4)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
    }
  },
  plugins: []
};

