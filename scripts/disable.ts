/* oxlint-disable no-console */
import { basename } from "jsr:@std/path";

import { getFullId, getId, getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

for (const dir of dirs) {
  const module = basename(dir);
  const id = getId(module);
  const fid = await getFullId(module);
  console.log(`Disabling ${fid}`);

  await new Deno.Command("spicetify", {
    args: ["pkg", "disable", `${id}@`],
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  }).output();

  await new Deno.Command("spicetify", {
    args: ["pkg", "delete", fid],
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  }).output();
}
