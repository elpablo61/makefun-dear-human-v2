import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Dear Human — one-line breakup entry.
// Reads entry.txt, validates it (1-200 chars), and copies it to the
// make.fun output directory as entry.txt.

const here = dirname(fileURLToPath(import.meta.url));
const entryPath = join(here, "entry.txt");
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(entryPath, "utf8");
const normalized = raw.replace(/\r\n?/g, "\n");
if (normalized.trim().split("\n").length > 1) {
  throw new Error(
    "entry.txt must be a single line: found multiple lines. Join them into one line of 1-200 characters.",
  );
}
const line = normalized.trimEnd();

if (line.trim().length === 0) {
  throw new Error(
    "entry.txt is empty or whitespace-only: the one-line entry must be 1-200 visible characters.",
  );
}
if (line.length > 200) {
  throw new Error(
    `entry.txt is ${line.length} characters, over the 200-character limit. Trim it to 200 characters or fewer.`,
  );
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line + "\n", "utf8");
