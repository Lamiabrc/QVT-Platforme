import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..", "..");

const result = spawnSync("npm", ["--prefix", rootDir, "run", "dev:qvtbox"], {
  stdio: "inherit",
});

process.exit(result.status ?? 0);
