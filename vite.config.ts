import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { envOnlyMacros } from "vite-env-only";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), envOnlyMacros()],
});
