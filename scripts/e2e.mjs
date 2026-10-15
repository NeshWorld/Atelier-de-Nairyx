import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const processTest = spawn(
  process.execPath,
  [
    join(root, "node_modules", "@playwright", "test", "cli.js"),
    "test",
    ...process.argv.slice(2),
  ],
  {
    cwd: root,
    stdio: "inherit",
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: join(root, ".local", "browsers"),
    },
  },
);
processTest.on("exit", (code) => process.exit(code ?? 1));
processTest.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
