import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchDir = path.join(__dirname, "..", "table-order-ap", "src");
const query = "confirm";

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes(query)) {
        console.log(`Match in: ${path.relative(searchDir, fullPath)}`);
      }
    }
  }
}

console.log(`Searching for "${query}" in ${searchDir}...`);
search(searchDir);
