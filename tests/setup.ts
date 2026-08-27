import "@testing-library/jest-dom/vitest";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the same `.env` the app uses so auth config (BETTER_AUTH_SECRET,
// BETTER_AUTH_URL) and DATABASE_URL are available in every test environment.
try {
  process.loadEnvFile(path.resolve(dirname, "../.env"));
} catch {
  // `.env` is optional; the environment may provide the variables directly.
}
