import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()], // <<< wichtig
    test: {
        environment: "jsdom",
        setupFiles: ["./tests/setup.ts"],
        globals: true,
        include: ["tests/**/*.test.{ts,tsx}"],
    },
    resolve: {
        alias: { "@": new URL("./src", import.meta.url).pathname }, // falls du src/ nutzt
    },
});
