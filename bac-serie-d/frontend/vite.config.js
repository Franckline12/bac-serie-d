import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  build: {
    // Évite le gel du build sur les conteneurs cloud comme Vercel
    ssr: false,
    minify: "terser", // Utilise un compilateur plus stable pour le cloud
  },
  server: {
    port: 5173,
    host: true,
  },
});
