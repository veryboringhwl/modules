/* oxlint-disable no-console */

import { join, resolve } from "jsr:@std/path";

export const MODULE_ROOT = resolve(import.meta.dirname!, "..");
export const MODULES_DIR = join(MODULE_ROOT, "modules");

export function getId(module: string): string {
  return module;
}

export async function getFullId(module: string): Promise<string> {
  const metadataPath = join(MODULES_DIR, module, "metadata.json");
  const metadata = JSON.parse(await Deno.readTextFile(metadataPath));
  return `${module}@${metadata.version}`;
}

export async function getModuleDirs(): Promise<string[]> {
  const dirs: string[] = [];
  try {
    for await (const entry of Deno.readDir(MODULES_DIR)) {
      if (entry.isDirectory) {
        dirs.push(join("modules", entry.name));
      }
    }
  } catch {
    console.warn("The 'modules' directory was not found.");
  }
  return dirs;
}
