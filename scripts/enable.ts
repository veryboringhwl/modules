/* oxlint-disable no-console */

import { basename } from "jsr:@std/path";

import { getFullId, getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

for (const dir of dirs) {
  const module = basename(dir);
  const fid = await getFullId(module);
  console.log(`Enabling ${fid}`);

  await new Deno.Command("spicetify", {
    args: ["pkg", "install", fid, dir],
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  }).output();

  await new Deno.Command("spicetify", {
    args: ["pkg", "enable", fid],
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  }).output();
}
