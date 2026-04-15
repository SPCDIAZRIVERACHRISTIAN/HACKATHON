import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/static/",
  server: {
    origin: "http://127.0.0.1:5173",
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: "/src/main.tsx",
    },
  },
  plugins: [react(), tailwindcss()],
});