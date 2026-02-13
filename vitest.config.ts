import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";

export default defineConfig({
  plugins: [
    {
      name: "markdown",
      transform(_, id) {
        if (id.endsWith(".md")) {
          const content = readFileSync(id, "utf-8");
          return {
            code: `export default ${JSON.stringify(content)};`,
            map: null,
          };
        }
      },
    },
  ],
  test: {
    // vitest defaults are fine
  },
});
