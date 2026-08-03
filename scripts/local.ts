/* oxlint-disable no-console */

import { dirname, join, resolve } from "jsr:@std/path";

import { GH_RAW_CLASSMAP_URL } from "./classmap-info.ts";
import { getModuleDirs, MODULE_ROOT } from "./vars.ts";

const BIN_NAME = Deno.build.os === "windows" ? "creator.exe" : "creator";
const REPO_ROOT = resolve(dirname(import.meta.dirname!), "..");
const DEFAULT_BIN = join(REPO_ROOT, "creator", "target", "release", BIN_NAME);
const BIN_PATH = Deno.env.get("CREATOR_BIN") ?? DEFAULT_BIN;

const buildProc = new Deno.Command("cargo", {
  args: ["build", "--release"],
  cwd: join(REPO_ROOT, "creator"),
  stdout: "inherit",
  stderr: "inherit"
});
const buildOutput = await buildProc.output();
if (!buildOutput.success) Deno.exit(buildOutput.code);

const [subcommand, ...rest] = Deno.args;

switch (subcommand) {
  case "build": {
    const dirs = rest.length > 0 ? rest : await getModuleDirs();
    await runOne(["build", "--modules", ...dirs, "-c", "classmap.json"]);

    break;
  }

  case "watch": {
    const dirs = rest.length > 0 ? rest : await getModuleDirs();
    await runOne(["watch", "--modules", ...dirs, "--classmap", "classmap.json"]);
    break;
  }

  case "release": {
    const releaseArgs = rest.includes("--classmap-url")
      ? rest
      : [...rest, "--classmap-url", GH_RAW_CLASSMAP_URL];
    await runOne(["release", ...releaseArgs]);
    break;
  }

  case undefined:
    await runOne([]);
    break;

  default:
    await runOne([subcommand, ...rest]);
}

async function runOne(args: string[]): Promise<void> {
  const proc = new Deno.Command(BIN_PATH, {
    args,
    cwd: MODULE_ROOT,
    stdout: "inherit",
    stderr: "inherit"
  });
  const status = await proc.spawn().status;
  Deno.exit(status.code ?? (status.success ? 0 : 1));
}
