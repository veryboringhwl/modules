/* oxlint-disable no-console */

import { getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

console.log(`Watching ${dirs.length} module(s)`);

const args = [
  "run",
  "-A",
  "@spicetify/creator",
  "watch",
  "--modules",
  ...dirs,
  "--classmap",
  "classmap.json"
];

const proc = new Deno.Command("deno", {
  args,
  cwd: MODULE_ROOT,
  stdout: "inherit",
  stderr: "inherit"
});

const { code } = await proc.output();
Deno.exit(code ?? 1);
