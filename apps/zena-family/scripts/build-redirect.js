import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, "..", "dist");
const target = "https://www.qvtbox.com/famille";

const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Redirection vers QVT Box</title>
    <script>window.location.replace("${target}");</script>
  </head>
  <body>
    <p>Redirection vers <a href="${target}">${target}</a>…</p>
  </body>
</html>
`;

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
writeFileSync(path.join(distDir, "index.html"), html, "utf8");
writeFileSync(path.join(distDir, "404.html"), html, "utf8");

console.log("zena-family redirect build generated");
