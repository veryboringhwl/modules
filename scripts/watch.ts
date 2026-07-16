/* oxlint-disable no-console */

import { basename } from "jsr:@std/path";

import { getId, getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

const procs: Promise<Deno.CommandOutput>[] = [];

for (const dir of dirs) {
  const module = basename(dir);
  const id = getId(module);
  console.log(`Watching ${id}`);

  const args = [
    "run",
    "-A",
    "@spicetify/creator",
    "build",
    "--module",
    id,
    "-i",
    dir,
    "-o",
    dir,
    "-c",
    "classmap.json",
    "-w",
    "--debounce",
    "1000",
    "--dev"
  ];

  const proc = new Deno.Command("deno", {
    args,
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  });
  procs.push(proc.output());
}

await Promise.all(procs);
console.log("Done");
