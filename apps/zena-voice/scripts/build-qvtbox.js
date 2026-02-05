import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..", "..", "..");
const qvtboxDist = path.join(rootDir, "apps", "qvtbox", "dist");
const targetDist = path.resolve(__dirname, "..", "dist");

const run = (cmd, args, options = {}) => {
  const result = spawnSync(cmd, args, { stdio: "inherit", ...options });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (!existsSync(path.join(rootDir, "node_modules"))) {
  run("npm", ["--prefix", rootDir, "install"]);
}

run("npm", ["--prefix", rootDir, "run", "build:qvtbox"]);

rmSync(targetDist, { recursive: true, force: true });
cpSync(qvtboxDist, targetDist, { recursive: true });

console.log("Zena-voice build completed: dist copied from apps/qvtbox");
