import { startEventHandlers } from "./api/events.ts";
import { createLogger } from "./api/logger.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export let logger: Console;

export default async (mod: ModuleInstance) => {
  logger = createLogger(mod);

  return startEventHandlers();
};
