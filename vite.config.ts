import devServer from "@hono/vite-dev-server"
import path from "path"
const __dirname = import.meta.dirname
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'plugin-inspect-react-code'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load all env vars (including non-VITE_ prefixed ones) and inject into
  // process.env so the Hono dev-server can read them via process.env.
  const env = loadEnv(mode, __dirname, "")
  Object.assign(process.env, env)

  return {
    plugins: [
      devServer({ entry: "api/boot.ts", exclude: [/^\/(?!api\/).*$/] }),
      inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@contracts": path.resolve(__dirname, "./contracts"),
        "@db": path.resolve(__dirname, "./db"),
        "db": path.resolve(__dirname, "./db"),
      },
    },
    // Externalize Node.js-only packages so Vite doesn't process them through
    // its module graph — without this, postgres.js networking hangs in dev.
    ssr: {
      external: ["postgres", "drizzle-orm"],
      noExternal: [],
    },
    envDir: path.resolve(__dirname),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      allowedHosts: true,
    },
  }
})
