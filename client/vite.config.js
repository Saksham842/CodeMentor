import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react-router-dom",

      "framer-motion",
      "zustand",
      "zustand/middleware",
      "gsap",
      "jszip",
      "react-dropzone",
      "react-hot-toast",
      "react-syntax-highlighter",
      "lucide-react",
      "recharts",
      "tailwind-merge",
      "clsx",
      "@radix-ui/react-dialog",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@gsap/react",
    ],
  },
});
