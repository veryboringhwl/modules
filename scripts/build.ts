import { basename } from "jsr:@std/path";

import { logger } from "./logger.ts";
import { getId, getModuleDirs, MODULE_ROOT } from "./vars.ts";

const dirs = Deno.args.length > 0 ? Deno.args : await getModuleDirs();

const jobs = dirs.map(async (dir) => {
  const module = basename(dir);
  const id = getId(module);

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
    "classmap.json"
  ];

  const proc = new Deno.Command("deno", {
    args,
    cwd: MODULE_ROOT,
    stdout: "piped",
    stderr: "piped"
  });

  const output = await proc.output();
  const decoder = new TextDecoder();

  const out = decoder.decode(output.stdout).trim();
  const err = decoder.decode(output.stderr).trim();

  if (out) logger.log(`[${id}] ${out}`);
  if (err) logger.error(`[${id}] ${err}`);

  if (!output.success) {
    throw new Error(`${id} build failed with code ${output.code}`);
  }
});

await Promise.all(jobs);
logger.log("Done");
