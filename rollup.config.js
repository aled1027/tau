import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";
import { readFileSync } from "fs";

/** Inline plugin: import .md files as raw string default exports */
function markdown() {
  return {
    name: "markdown",
    load(id) {
      if (id.endsWith(".md")) {
        const content = readFileSync(id, "utf-8");
        return `export default ${JSON.stringify(content)};`;
      }
    },
  };
}

export default [
  {
    input: "src/core/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: false,
    },
    plugins: [
      markdown(),
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  {
    input: "src/core/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [dts({ tsconfig: "./tsconfig.build.json" })],
  },
];
