import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // TanStack Start's Vite plugin must come before React's Vite plugin
    tanstackStart(),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
});
