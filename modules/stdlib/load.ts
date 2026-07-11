import { hotwired, type LoadContext } from "/hooks/module.ts";

import { startEventHandlers } from "./src/events.ts";
import { createLogger } from "./src/logger.ts";

const cancelEventHandlers = startEventHandlers();

const { promise, signal, module: mod } = await hotwired<LoadContext>(import.meta);

export const logger = createLogger(mod);

signal.addEventListener("abort", () => {
  cancelEventHandlers();
});

promise.resolve(() => {
  cancelEventHandlers();
});
