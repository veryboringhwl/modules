/* oxlint-disable no-console */

import { GH_RAW_CLASSMAP_URL } from "./classmap-info.ts";
import { getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

console.log(`Releasing ${dirs.length} module(s)`);

const args = [
  "run",
  "-A",
  "@spicetify/creator",
  "release",
  ...dirs,
  "--classmap-url",
  GH_RAW_CLASSMAP_URL,
  "--output-dir",
  "dist"
];

const proc = new Deno.Command("deno", {
  args,
  cwd: MODULE_ROOT,
  stdout: "inherit",
  stderr: "inherit"
});

const { code } = await proc.output();
Deno.exit(code ?? 1);
