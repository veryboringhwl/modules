/* oxlint-disable no-console */

import { GH_RAW_CLASSMAP_URL } from "./classmap-info.ts";
import { MODULE_ROOT } from "./vars.ts";

console.log("Fetching classmap...");

const args = [
  "run",
  "-A",
  "@spicetify/creator",
  "classmap-fetch",
  "--url",
  GH_RAW_CLASSMAP_URL,
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
