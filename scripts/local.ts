#!/usr/bin/env -S deno run -A
/**
 * Run the locally-built `creator` binary (the one built from
 * `../creator/target/release/creator[.exe]`) instead of fetching from
 * JSR. Used to test a fresh creator build before publishing.
 *
 * Subcommands mirror the existing build/watch/release scripts so the
 * same flags and dir arguments work:
 *
 *   deno task local build           - build all modules (or `modules/foo` for one)
 *   deno task local watch           - watch all modules
 *   deno task local release         - run release
 *   deno task local new --name ...  - forward `new` to the local binary
 *   deno task local help            - forward any other subcommand
 *
 * Override the binary path with the `CREATOR_BIN` environment variable.
 * Build the binary with `cargo build --release` inside `../creator/`.
 */
import { basename, dirname, join, resolve } from "jsr:@std/path";

import { logger } from "./logger.ts";
import { getId, getModuleDirs, MODULE_ROOT } from "./vars.ts";

const BIN_NAME = Deno.build.os === "windows" ? "creator.exe" : "creator";
const REPO_ROOT = resolve(dirname(import.meta.dirname!), "..");
const DEFAULT_BIN = join(REPO_ROOT, "creator", "target", "release", BIN_NAME);
const BIN_PATH = Deno.env.get("CREATOR_BIN") ?? DEFAULT_BIN;

if (!(await fileExists(BIN_PATH))) {
  logger.error(`local creator binary not found at: ${BIN_PATH}`);
  logger.error("");
  logger.error("Build it with:");
  logger.error(`  cd ${join(REPO_ROOT, "creator")}`);
  logger.error("  cargo build --release");
  logger.error("");
  logger.error("Or set CREATOR_BIN to an existing binary.");
  Deno.exit(1);
}

const [subcommand, ...rest] = Deno.args;

switch (subcommand) {
  case "build":
    await runPerModule("Build", rest, (dir) => {
      const module = basename(dir);
      const id = getId(module);
      return ["build", "--module", id, "-i", dir, "-o", dir, "-c", "classmap.json"];
    });
    break;

  case "watch":
    await runPerModule("Watch", rest, (dir) => {
      const module = basename(dir);
      const id = getId(module);
      return [
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
    });
    break;

  case "release":
    await runOne(["release", ...rest]);
    break;

  case undefined:
    // No subcommand: show the binary's help.
    await runOne([]);
    break;

  default:
    // Any other subcommand: forward to the binary.
    await runOne([subcommand, ...rest]);
}

async function runPerModule(
  label: string,
  dirArgs: string[],
  buildArgs: (dir: string) => string[]
): Promise<void> {
  const dirs = dirArgs.length > 0 ? dirArgs : await getModuleDirs();
  const procs = dirs.map((dir) => {
    const proc = new Deno.Command(BIN_PATH, {
      args: buildArgs(dir),
      cwd: MODULE_ROOT,
      stdout: "inherit",
      stderr: "inherit"
    });
    return proc.output();
  });
  await Promise.all(procs);
  logger.log("Done");
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

async function fileExists(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isFile;
  } catch {
    return false;
  }
}
