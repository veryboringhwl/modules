const CONSOLE = globalThis.console;

const METHODS = ["debug", "error", "info", "log", "warn"] as const;

type Logger = Record<(typeof METHODS)[number], (...args: unknown[]) => void>;

const logger = {} as Logger;
for (const method of METHODS) {
  logger[method] = (...args: unknown[]) => {
    const fn = Reflect.get(CONSOLE, method);
    if (typeof fn === "function") {
      fn.call(CONSOLE, ...args);
    }
  };
}

export { logger };
