import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

export default [
  {
    input: "src/core/index.ts",
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: false,
    },
    plugins: [
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
