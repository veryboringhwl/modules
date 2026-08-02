import type { ModuleInstance } from "/hooks/module.ts";

const HOOKED_METHODS = new Set(["debug", "error", "info", "log", "warn"]);

export const createLogger = (mod: ModuleInstance) => {
  return new Proxy(globalThis.console, {
    get(target, p, receiver) {
      const func: unknown = Reflect.get(target, p, receiver);

      if (typeof p === "string" && HOOKED_METHODS.has(p) && typeof func === "function") {
        return (...data: any[]) => func.call(target, `[${mod.getModuleIdentifier()}]:`, ...data);
      }

      return func;
    }
  });
};
