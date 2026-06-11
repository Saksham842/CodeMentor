/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: "#050508",
        abyss: "#0a0a12",
        cavern: "#12121e",
        vault: "#1a1a2e",
        rift: "#1e1e3a",
        nebula: "#7c3aed",
        aurora: "#6366f1",
        comet: "#a78bfa",
        stardust: "#c4b5fd",
        nova: "#10b981",
        solar: "#f59e0b",
        supernova: "#ef4444",
        cosmic: "#06b6d4",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
