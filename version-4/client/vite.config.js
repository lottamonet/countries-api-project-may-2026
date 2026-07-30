// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "https://countries-app-o1s6.onrender.com",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [react()],
});