/**
 * Declarative settings system.
 *
 * Define your module's settings as a schema, and the system gives you
 * type-safe reads, writes, a React hook that re-renders only on the
 * settings you actually subscribe to, and a drop-in `<SettingsPage>`
 * component that renders the whole page from the schema.
 *
 * ## Example
 *
 * ```ts
 * import { createSettings, defineSettings, toggle, pill, colorSwatch } from "stdlib";
 *
 * const schema = defineSettings({
 *   enableBlur:   toggle({ default: true,  label: "Blur background" }),
 *   fontSize:     pill({   default: "default", options: [...]
 *                          as const,   label: "Font size" }),
 *   accentColor:  colorSwatch({ default: "spotify",
 *                              options: [...] as const, label: "Accent" })
 * });
 *
 * const settings = createSettings(mod, schema);
 *
 * // In a component:
 * const blur      = settings.useSetting("enableBlur");
 * const fontSize  = settings.useSetting("fontSize");
 * const everything = settings.useSettings();
 *
 * // Render the whole settings page:
 * <SettingsPage schema={schema} settings={settings} title="My Module" />
 * ```
 *
 * The schema entries carry the *UI metadata* (label, description,
 * group, kind-specific options) so the `<SettingsPage>` can render
 * the right input for each entry without the dev writing a single
 * row component.
 */

import { React } from "./expose/React.ts";
import { future } from "./expose/SettingsSection.ts";
import { createStorage } from "./storage.ts";

import type { ModuleInstance } from "/hooks/module.ts";

// =====================================================================
//  Setting kinds & option types
// =====================================================================

export type SettingKind = "toggle" | "pill" | "slider" | "number" | "text" | "color" | "button";

export type PillOption<T extends string> = {
  readonly value: T;
  readonly label: string;
};

export type ColorOption<T extends string> = {
  readonly value: T;
  readonly label: string;
  readonly color: string;
};

type BaseOpts = {
  /** Human-readable label shown on the left of the row. */
  readonly label?: string;
  /** Optional description shown beneath the label. */
  readonly description?: string;
  /** Optional group; rows are grouped by this in the rendered page. */
  readonly group?: string;
  /** When true, the setting is persisted but not shown in the UI. */
  readonly hidden?: boolean;
};

// =====================================================================
//  Per-kind setting definitions
// =====================================================================

export type ToggleSetting = BaseOpts & {
  readonly kind: "toggle";
  readonly default: boolean;
};

export type PillSetting<T extends string> = BaseOpts & {
  readonly kind: "pill";
  readonly default: T;
  readonly options: readonly PillOption<T>[];
};

export type SliderSetting = BaseOpts & {
  readonly kind: "slider";
  readonly default: number;
  readonly min: number;
  readonly max: number;
  readonly step?: number;
};

export type NumberSetting = BaseOpts & {
  readonly kind: "number";
  readonly default: number;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
};

export type TextSetting = BaseOpts & {
  readonly kind: "text";
  readonly default: string;
  readonly placeholder?: string;
};

export type ColorSetting<T extends string> = BaseOpts & {
  readonly kind: "color";
  readonly default: T;
  readonly options: readonly ColorOption<T>[];
};

export type ButtonSetting = BaseOpts & {
  readonly kind: "button";
  readonly label: string;
  readonly description?: string;
  readonly group?: string;
  readonly onClick: () => void;
};

export type Setting =
  | ToggleSetting
  | PillSetting<string>
  | SliderSetting
  | NumberSetting
  | TextSetting
  | ColorSetting<string>
  | ButtonSetting;

export type SettingsSchema = Record<string, Setting>;

// =====================================================================
//  Type inference
// =====================================================================

type InferSettingValue<S> = S extends ToggleSetting
  ? boolean
  : S extends PillSetting<infer T>
    ? T
    : S extends SliderSetting
      ? number
      : S extends NumberSetting
        ? number
        : S extends TextSetting
          ? string
          : S extends ColorSetting<infer T>
            ? T
            : S extends ButtonSetting
              ? null
              : never;

export type SettingsSnapshot<S extends SettingsSchema> = {
  [K in keyof S]: InferSettingValue<S[K]>;
};

// =====================================================================
//  Schema-builder helpers
//
//  These functions are *not* runtime-heavy — they return plain objects
//  that the type system can introspect. Use them to build the schema:
//
//      const schema = defineSettings({ myToggle: toggle({ default: true }) });
// =====================================================================

/** Mark an object literal as a settings schema. Mostly for clarity. */
export function defineSettings<S extends SettingsSchema>(schema: S): S {
  return schema;
}

export function toggle(opts: {
  default: boolean;
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): ToggleSetting {
  const { default: def, ...rest } = opts;
  return { kind: "toggle", default: def, ...rest };
}

export function pill<T extends string>(opts: {
  default: T;
  options: readonly PillOption<T>[];
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): PillSetting<T> {
  const { default: def, options, ...rest } = opts;
  return { kind: "pill", default: def, options, ...rest };
}

export function slider(opts: {
  default: number;
  min: number;
  max: number;
  step?: number;
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): SliderSetting {
  const { default: def, ...rest } = opts;
  return { kind: "slider", default: def, ...rest };
}

export function numberSetting(opts: {
  default: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): NumberSetting {
  const { default: def, ...rest } = opts;
  return { kind: "number", default: def, ...rest };
}

export function textSetting(opts: {
  default: string;
  placeholder?: string;
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): TextSetting {
  const { default: def, ...rest } = opts;
  return { kind: "text", default: def, ...rest };
}

export function colorSwatch<T extends string>(opts: {
  default: T;
  options: readonly ColorOption<T>[];
  label?: string;
  description?: string;
  group?: string;
  hidden?: boolean;
}): ColorSetting<T> {
  const { default: def, options, ...rest } = opts;
  return { kind: "color", default: def, options, ...rest };
}

export function button(opts: {
  label: string;
  onClick: () => void;
  description?: string;
  group?: string;
  hidden?: boolean;
}): ButtonSetting {
  return { kind: "button", ...opts };
}

// =====================================================================
//  Settings instance
// =====================================================================

type Listener = () => void;

export type Settings<S extends SettingsSchema> = {
  /** Read the current value of `key`. */
  get<K extends keyof S>(key: K): SettingsSnapshot<S>[K];
  /** Write a new value for `key` and notify subscribers. */
  set<K extends keyof S>(key: K, value: SettingsSnapshot<S>[K]): void;
  /**
   * React hook returning the *current* value of a single setting.
   *
   * The component re-renders **only** when this specific key's
   * value changes — it does not re-render on changes to other
   * settings. This is the recommended hook for performance.
   */
  useSetting<K extends keyof S>(key: K): SettingsSnapshot<S>[K];
  /**
   * React hook returning a snapshot of *all* settings.
   *
   * The component re-renders on **any** setting change. Use this
   * only when the component genuinely depends on multiple settings
   * at once.
   */
  useSettings(): SettingsSnapshot<S>;
  /** Subscribe to *any* setting change. Returns an unsubscribe. */
  subscribe(listener: Listener): () => void;
  /** The schema this instance was created with. */
  readonly schema: S;
};

/**
 * Build a `Settings` instance backed by the module's localStorage.
 *
 * The instance manages:
 *   - Reads via the cached `cache` map (one localStorage hit per key
 *     per process, then in-memory).
 *   - Writes that persist to localStorage *and* invalidate the cache
 *     entry.
 *   - A `Set<Listener>` of subscribers, notified on every write.
 */
export function createSettings<S extends SettingsSchema>(
  mod: ModuleInstance,
  schema: S
): Settings<S> {
  const storage = createStorage(mod);
  const listeners = new Set<Listener>();

  // In-memory cache. Avoids hitting localStorage on every read while
  // keeping the "source of truth" on disk.
  const cache = new Map<keyof S, unknown>();

  const readValue = <K extends keyof S>(key: K): SettingsSnapshot<S>[K] => {
    const cached = cache.get(key);
    if (cached !== undefined) return cached as SettingsSnapshot<S>[K];

    const def = schema[key];
    let value: unknown;
    if (def.kind === "button") {
      value = null;
    } else {
      const raw = storage.getItem(String(key));
      if (raw === null) {
        value = def.default;
      } else {
        try {
          value = JSON.parse(raw);
        } catch {
          value = def.default;
        }
      }
    }
    cache.set(key, value);
    return value as SettingsSnapshot<S>[K];
  };

  const writeValue = <K extends keyof S>(key: K, value: SettingsSnapshot<S>[K]): void => {
    if (schema[key].kind === "button") return;
    storage.setItem(String(key), JSON.stringify(value));
    cache.set(key, value);
    for (const listener of listeners) listener();
  };

  const subscribe = (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // Eagerly read all known values so the initial render is consistent
  // even if a downstream `useSettings` is called before the first
  // component mounts.
  for (const key of Object.keys(schema) as Array<keyof S>) {
    readValue(key);
  }

  return {
    get: readValue,
    set: writeValue,

    useSetting(key) {
      const [value, setValue] = React.useState(() => readValue(key));
      React.useEffect(() => {
        let lastValue = readValue(key);
        const refresh = (): void => {
          const newValue = readValue(key);
          // Skip the setState if nothing changed — avoids spurious
          // re-renders on writes to *other* settings.
          if (!Object.is(newValue, lastValue)) {
            lastValue = newValue;
            setValue(newValue);
          }
        };
        const unsubscribe = subscribe(refresh);
        // Settings defined in a *later* module load may miss the
        // initial notification. Pull once on mount to be safe.
        future.pull(refresh);
        return unsubscribe;
        // The `key` is captured in the closure; re-subscribing on
        // key change would be wasted work since keys are stable for
        // the lifetime of a schema.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
      return value;
    },

    useSettings() {
      const [snapshot, setSnapshot] = React.useState(() => {
        const snap = {} as SettingsSnapshot<S>;
        for (const key of Object.keys(schema) as Array<keyof S>) {
          snap[key] = readValue(key);
        }
        return snap;
      });
      React.useEffect(() => {
        const refresh = (): void => {
          const snap = {} as SettingsSnapshot<S>;
          for (const key of Object.keys(schema) as Array<keyof S>) {
            snap[key] = readValue(key);
          }
          setSnapshot(snap);
        };
        const unsubscribe = subscribe(refresh);
        future.pull(refresh);
        return unsubscribe;
      }, []);
      return snapshot;
    },

    subscribe,
    schema
  };
}
