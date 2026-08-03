import { moduleDefinedSubject, moduleExecutedSubject, webpackRequire } from "./webpackRuntime.ts";

import type { WebpackModule, WebpackRequire } from "./webpackRuntime.ts";

export type Match = string | RegExp;
export type AnyMatch = Match | { matches: Match[]; mode: "any" | "all" };
export type ModuleMatcher = (id: keyof any, module: WebpackModule) => boolean;

export type SourcePredicate = {
  test: (src: string) => boolean;
};

export type ExportFilter = ((moduleExport: any) => boolean) & {
  source?: SourcePredicate;
};

const IDENTIFIER_REGEX = String.raw`(?:[A-Za-z_$][\w$]*)`;

const createExtendedRegExp = (regex: RegExp): RegExp =>
  new RegExp(regex.source.replaceAll(String.raw`\i`, IDENTIFIER_REGEX), regex.flags);

export function srcMatches(src: string, match: AnyMatch): boolean {
  if (typeof match === "string") {
    return src.includes(match);
  }

  if (match instanceof RegExp) {
    return createExtendedRegExp(match).test(src);
  }

  return match.mode === "all"
    ? match.matches.every((m) => srcMatches(src, m))
    : match.matches.some((m) => srcMatches(src, m));
}

export const sourceOf = (value: unknown): string => {
  try {
    return Function.prototype.toString.call(value);
  } catch {
    return "";
  }
};

export function shouldIgnoreValue(value: any): boolean {
  if ([undefined, null, window, document, document.documentElement].includes(value)) {
    return true;
  }

  return value?.[Symbol.toStringTag] === "DOMTokenList";
}

export function shouldIgnoreModule(exports: any): boolean {
  if (shouldIgnoreValue(exports)) {
    return true;
  }

  if (typeof exports !== "object") {
    return false;
  }

  for (const key in exports) {
    if (!shouldIgnoreValue(exports[key])) {
      return false;
    }
  }

  return true;
}

export const byCode = (match: AnyMatch): ExportFilter => {
  const matches = (moduleExport: any): boolean =>
    typeof moduleExport === "function" && srcMatches(sourceOf(moduleExport), match);

  const filter: ExportFilter = (moduleExport: any): boolean => {
    if (typeof moduleExport !== "function") {
      return false;
    }

    if (matches(moduleExport)) {
      return true;
    }

    if (!moduleExport.$$typeof) {
      return false;
    }

    if (moduleExport.render) {
      return matches(moduleExport.render);
    }

    const { type } = moduleExport;
    if (typeof type === "function" || (typeof type === "object" && type !== null)) {
      return type.render ? matches(type.render) : matches(type);
    }

    return false;
  };
  filter.source = { test: (src) => srcMatches(src, match) };

  return filter;
};

export const byComponentCode = (match: AnyMatch): ExportFilter => {
  const matches = (src: string): boolean => srcMatches(src, match);

  const filter: ExportFilter = (moduleExport: any): boolean => {
    if (typeof moduleExport !== "object" || moduleExport === null || !moduleExport.$$typeof) {
      return false;
    }

    if (moduleExport.render && matches(sourceOf(moduleExport.render))) {
      return true;
    }

    const { type } = moduleExport;
    if (typeof type === "function") {
      return matches(sourceOf(type));
    }

    if (typeof type === "object" && type !== null) {
      return type.render ? matches(sourceOf(type.render)) : matches(sourceOf(type));
    }

    return false;
  };
  filter.source = { test: (src) => srcMatches(src, match) };

  return filter;
};

export const byProps = (...props: string[]): ExportFilter => {
  const filter: ExportFilter = (moduleExport: any): boolean =>
    moduleExport !== null &&
    (typeof moduleExport === "object" || typeof moduleExport === "function") &&
    props.every((prop) => prop in moduleExport);
  filter.source = { test: (src) => props.every((prop) => src.includes(prop)) };

  return filter;
};

export const byEncoreName = (name: string): ExportFilter => {
  const filter = byCode({
    matches: [
      new RegExp(String.raw`"data-encore-id":\i\.\i\.${name}[\s,}]`),
      new RegExp(`"data-testid":"${name}"`)
    ],
    mode: "any"
  });

  const result: ExportFilter = (moduleExport: any): boolean =>
    moduleExport?.displayName === name || filter(moduleExport);
  result.source = filter.source;

  return result;
};

export const byFactorySource =
  (match: AnyMatch): ModuleMatcher =>
  (_id, module) =>
    srcMatches(sourceOf(module), match);

interface ExportSubscription {
  filter: ExportFilter;
  callback: (id: keyof any, moduleExport: any) => void;
}

interface ModuleSubscription {
  props: string[];
  callback: (module: any) => void;
}

interface ModuleByExportSubscription {
  filter: ExportFilter;
  callback: (module: any) => void;
}

type ExportSource<T = any> = { id: keyof any; value: T };

const moduleCache = new Map<keyof any, any>();
const exportSubscriptions = new Set<ExportSubscription>();
const moduleSubscriptions = new Set<ModuleSubscription>();
const moduleByExportSubscriptions = new Set<ModuleByExportSubscription>();

function checkExport(moduleExport: any, filter: ExportFilter): boolean {
  if (shouldIgnoreValue(moduleExport)) {
    return false;
  }

  return filter(moduleExport);
}

function handleExecuted([id, exports]: [keyof any, any]): void {
  moduleCache.set(id, exports);

  for (const subscription of exportSubscriptions) {
    if (checkExport(exports, subscription.filter)) {
      exportSubscriptions.delete(subscription);
      subscription.callback(id, exports);
      continue;
    }

    if (typeof exports !== "object" || exports === null) {
      continue;
    }

    for (const child of Object.values(exports)) {
      if (checkExport(child, subscription.filter)) {
        exportSubscriptions.delete(subscription);
        subscription.callback(id, child);
        break;
      }
    }
  }

  for (const subscription of moduleByExportSubscriptions) {
    if (shouldIgnoreModule(exports)) {
      continue;
    }

    const containsMatch =
      checkExport(exports, subscription.filter) ||
      (typeof exports === "object" &&
        exports !== null &&
        Object.values(exports).some((child) => checkExport(child, subscription.filter)));
    if (containsMatch) {
      moduleByExportSubscriptions.delete(subscription);
      subscription.callback(exports);
    }
  }

  for (const subscription of moduleSubscriptions) {
    if (typeof exports !== "object" || exports === null) {
      continue;
    }

    if (!subscription.props.every((prop) => prop in exports)) {
      continue;
    }

    moduleSubscriptions.delete(subscription);
    subscription.callback(exports);
  }
}

moduleExecutedSubject.subscribe(handleExecuted);

function getWebpackRequire(): WebpackRequire | undefined {
  return webpackRequire ?? globalThis.__webpack_require__;
}

function executeFactory(wpr: WebpackRequire, id: keyof any): any {
  try {
    return wpr(id);
  } catch (error) {
    console.warn("[std:webpack] module execution failed", id, error);
    return undefined;
  }
}

function findCachedExports(filter: ExportFilter): ExportSource[] {
  const results: ExportSource[] = [];

  for (const [id, exports] of moduleCache) {
    if (shouldIgnoreModule(exports)) {
      continue;
    }

    if (checkExport(exports, filter)) {
      results.push({ id, value: exports });
      continue;
    }

    if (typeof exports !== "object" || exports === null) {
      continue;
    }

    for (const child of Object.values(exports)) {
      if (checkExport(child, filter)) {
        results.push({ id, value: child });
      }
    }
  }

  return results;
}

function findFactoryExports(filter: ExportFilter): ExportSource[] {
  const { source } = filter;
  if (!source) {
    return [];
  }

  const wpr = getWebpackRequire();
  if (!wpr) {
    return [];
  }

  const results: ExportSource[] = [];

  for (const [id, factory] of Object.entries(wpr.m)) {
    if (typeof factory !== "function" || moduleCache.has(id)) {
      continue;
    }

    if (!source.test(sourceOf(factory))) {
      continue;
    }

    const exports = executeFactory(wpr, id);
    if (exports === undefined) {
      continue;
    }

    if (checkExport(exports, filter)) {
      results.push({ id, value: exports });
      continue;
    }

    if (typeof exports !== "object" || exports === null) {
      continue;
    }

    for (const child of Object.values(exports)) {
      if (checkExport(child, filter)) {
        results.push({ id, value: child });
      }
    }
  }

  return results;
}

function findExportSource<T = any>(filter: ExportFilter): ExportSource<T> | undefined {
  return (findCachedExports(filter)[0] ?? findFactoryExports(filter)[0]) as
    | ExportSource<T>
    | undefined;
}

export function findAllModuleExports<T = any>(filter: ExportFilter): T[] {
  return [...findCachedExports(filter), ...findFactoryExports(filter)].map(
    ({ value }) => value
  ) as T[];
}

export function getModuleExport<T = any>(filter: ExportFilter): T | undefined {
  return findExportSource<T>(filter)?.value;
}

export function findModuleExport<T = any>(filter: ExportFilter): Promise<T> {
  const sync = getModuleExport<T>(filter);
  if (sync !== undefined) {
    return Promise.resolve(sync);
  }

  return new Promise((resolve) => {
    exportSubscriptions.add({
      filter,
      callback: (_id, moduleExport) => resolve(moduleExport as T)
    });
  });
}

export function resolveInto<T = any>(filter: ExportFilter, onChange: (value: T) => void): void {
  const sync = getModuleExport<T>(filter);
  if (sync !== undefined) {
    onChange(sync);
    return;
  }

  exportSubscriptions.add({
    filter,
    callback: (_id, moduleExport) => onChange(moduleExport as T)
  });
}

export function resolveIntoSource<T = any>(
  filter: ExportFilter,
  onChange: (id: keyof any, value: T) => void
): void {
  const sync = findExportSource<T>(filter);
  if (sync !== undefined) {
    onChange(sync.id, sync.value);
    return;
  }

  exportSubscriptions.add({
    filter,
    callback: (id, moduleExport) => onChange(id, moduleExport as T)
  });
}

export function resolveIntoModule(matcher: ModuleMatcher, onChange: (exports: any) => void): void {
  const sync = matchModuleSync(matcher);
  if (sync) {
    onChange(sync[1]);
    return;
  }

  const subscription = moduleDefinedSubject.subscribe(([id, module]) => {
    if (!matcher(id, module)) {
      return;
    }

    subscription.unsubscribe();

    try {
      onChange(webpackRequire(id));
    } catch (error) {
      console.warn("[std:webpack] module execution deferred", id, error);
      resolveOnExecuted(matcher, (_executedId, exports) => onChange(exports));
    }
  });
}

function findCachedModule(...props: string[]): any | undefined {
  for (const exports of moduleCache.values()) {
    if (typeof exports === "object" && exports !== null && props.every((prop) => prop in exports)) {
      return exports;
    }
  }

  return undefined;
}

function findFactoryModule(...props: string[]): any | undefined {
  const wpr = getWebpackRequire();
  if (!wpr) {
    return undefined;
  }

  for (const [id, factory] of Object.entries(wpr.m)) {
    if (typeof factory !== "function" || moduleCache.has(id)) {
      continue;
    }

    const src = sourceOf(factory);
    if (!props.every((prop) => src.includes(prop))) {
      continue;
    }

    const exports = executeFactory(wpr, id);
    if (exports === undefined) {
      continue;
    }

    if (typeof exports === "object" && exports !== null && props.every((prop) => prop in exports)) {
      return exports;
    }
  }

  return undefined;
}

export function findModule<T = Record<string, any>>(...props: string[]): Promise<T> {
  const sync = findCachedModule(...props) ?? findFactoryModule(...props);
  if (sync !== undefined) {
    return Promise.resolve(sync as T);
  }

  return new Promise((resolve) => {
    moduleSubscriptions.add({
      props,
      callback: (module) => resolve(module as T)
    });
  });
}

function matchesModuleOrChild(exports: any, filter: ExportFilter): boolean {
  if (shouldIgnoreModule(exports)) {
    return false;
  }

  return (
    checkExport(exports, filter) ||
    (typeof exports === "object" &&
      exports !== null &&
      Object.values(exports).some((child) => checkExport(child, filter)))
  );
}

function findModuleByFactory<T = Record<string, any>>(filter: ExportFilter): T | undefined {
  const { source } = filter;
  if (!source) {
    return undefined;
  }

  const wpr = getWebpackRequire();
  if (!wpr) {
    return undefined;
  }

  for (const [id, factory] of Object.entries(wpr.m)) {
    if (typeof factory !== "function" || moduleCache.has(id)) {
      continue;
    }

    if (!source.test(sourceOf(factory))) {
      continue;
    }

    const exports = executeFactory(wpr, id);
    if (exports !== undefined && matchesModuleOrChild(exports, filter)) {
      return exports;
    }
  }

  return undefined;
}

export function findModuleByExportSync<T = Record<string, any>>(
  filter: ExportFilter
): T | undefined {
  for (const exports of moduleCache.values()) {
    if (matchesModuleOrChild(exports, filter)) {
      return exports as T;
    }
  }

  return findModuleByFactory<T>(filter);
}

export function findModuleByExport<T = Record<string, any>>(filter: ExportFilter): Promise<T> {
  const sync = findModuleByExportSync<T>(filter);
  if (sync !== undefined) {
    return Promise.resolve(sync);
  }

  return new Promise((resolve) => {
    moduleByExportSubscriptions.add({
      filter,
      callback: (module) => resolve(module as T)
    });
  });
}

export function matchModuleSyncAll(matcher: ModuleMatcher): Array<[keyof any, any]> {
  const results: Array<[keyof any, any]> = [];

  const wpr = getWebpackRequire();
  if (!wpr) {
    return results;
  }

  for (const [id, module] of Object.entries(wpr.m)) {
    if (!matcher(id, module)) {
      continue;
    }

    try {
      results.push([id, wpr(id)]);
    } catch (error) {
      console.warn("[std:webpack] module execution failed", id, error);
    }
  }

  return results;
}

export function matchModuleSync(matcher: ModuleMatcher): [keyof any, any] | null {
  return matchModuleSyncAll(matcher)[0] ?? null;
}

export function matchModule(matcher: ModuleMatcher): Promise<[keyof any, any]> {
  const sync = matchModuleSync(matcher);
  if (sync) {
    return Promise.resolve(sync);
  }

  return new Promise((resolve) => {
    const subscription = moduleDefinedSubject.subscribe(([id, module]) => {
      if (!matcher(id, module)) {
        return;
      }

      subscription.unsubscribe();

      try {
        resolve([id, webpackRequire(id)]);
      } catch (error) {
        console.warn("[std:webpack] module execution deferred", id, error);
        resolveOnExecuted(matcher, (executedId, exports) => resolve([executedId, exports]));
      }
    });
  });
}

function resolveOnExecuted(
  matcher: ModuleMatcher,
  onChange: (id: keyof any, exports: any) => void
): void {
  const wpr = getWebpackRequire();
  if (!wpr) {
    return;
  }

  const subscription = moduleExecutedSubject.subscribe(([id, exports]) => {
    const factory = wpr.m[id];
    if (typeof factory !== "function" || !matcher(id, factory)) {
      return;
    }

    subscription.unsubscribe();
    onChange(id, exports);
  });
}
