import { logger } from "./logger.ts";
import { MODULE_ROOT } from "./vars.ts";

logger.log("Fetching classmap...");

const args = [
  "run",
  "-A",
  "@spicetify/creator",
  "classmap-fetch",
  "--modules-dir",
  "modules",
  "--output",
  "classmap.json"
];

const { code } = await new Deno.Command("deno", {
  args,
  cwd: MODULE_ROOT,
  stdout: "inherit",
  stderr: "inherit"
}).output();

Deno.exit(code);
