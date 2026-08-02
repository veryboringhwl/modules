import { future } from "../core/mod.ts";
import { React } from "../libs/react.ts";
import { createStorage } from "./storage.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export type Settings = {
  get<T = unknown>(key: string, fallback?: T): T;
  set(key: string, value: unknown): void;
  useSetting<T = unknown>(key: string, fallback?: T): T;
  subscribe(listener: Listener): () => void;
};

export function createSettings(mod: ModuleInstance): Settings {
  const storage = createStorage(mod);
  const listeners = new Set<Listener>();

  const cache = new Map<string, unknown>();

  const readValue = (key: string, fallback?: unknown): unknown => {
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const raw = storage.getItem(key);
    let value: unknown;
    if (raw === null) {
      value = fallback ?? null;
    } else {
      try {
        value = JSON.parse(raw);
      } catch {
        value = fallback ?? null;
      }
    }
    cache.set(key, value);
    return value;
  };

  const writeValue = (key: string, value: unknown): void => {
    storage.setItem(key, JSON.stringify(value));
    cache.set(key, value);
    for (const listener of listeners) listener();
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return {
    get: readValue,
    set: writeValue,

    useSetting(key, fallback) {
      const [value, setValue] = React.useState(() => readValue(key, fallback));
      React.useEffect(() => {
        let lastValue = readValue(key, fallback);
        const refresh = (): void => {
          const newValue = readValue(key, fallback);
          if (!Object.is(newValue, lastValue)) {
            lastValue = newValue;
            setValue(newValue);
          }
        };
        const unsubscribe = subscribe(refresh);
        future.pull(refresh);
        return unsubscribe;
      }, [key, fallback]);
      return value;
    },

    subscribe
  };
}
