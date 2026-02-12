/**
 * Rollup plugin that embeds all src/core/*.ts files as a virtual module.
 *
 * Import in code with:
 *   import { sourceFiles } from "virtual:pi-browser-sources";
 *
 * sourceFiles is a Record<string, string> mapping relative paths
 * (e.g. "src/core/agent.ts") to file contents.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, relative } from "path";

const VIRTUAL_ID = "virtual:pi-browser-sources";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

export default function embedSources(rootDir = process.cwd()) {
  return {
    name: "embed-pi-browser-sources",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },

    load(id) {
      if (id !== RESOLVED_ID) return null;

      const files = {};

      const collectFiles = (dir) => {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          const full = resolve(dir, entry);
          const stat = statSync(full);
          if (stat.isDirectory()) {
            collectFiles(full);
          } else if (entry.endsWith(".ts")) {
            const relPath = relative(rootDir, full);
            files[relPath] = readFileSync(full, "utf-8");
          }
        }
      };

      collectFiles(resolve(rootDir, "src/core"));

      return `export const sourceFiles = ${JSON.stringify(files, null, 2)};`;
    },
  };
}
