import { createApi, resolve } from "../core/expose.ts";
import { byCode, sourceOf } from "../core/webpack.ts";
import { moduleExecutedSubject, webpackRequire } from "../core/webpackRuntime.ts";

import type { PersistQueryClientProvider as PersistQueryClientProviderT } from "npm:@tanstack/react-query-persist-client";
import type {
  notifyManager as notifyManagerT,
  QueryClientProvider as QueryClientProviderT,
  QueryClient as QueryClientT,
  useInfiniteQuery as useInfiniteQueryT,
  useIsFetching as useIsFetchingT,
  useIsMutating as useIsMutatingT,
  useMutation as useMutationT,
  useQueryClient as useQueryClientT,
  useQuery as useQueryT,
  useSuspenseQuery as useSuspenseQueryT
} from "npm:@tanstack/react-query@5.90.20";
// spotify uses v5.90.20 as of 2026-08-05

export type ReactQueryApi = {
  QueryClient: typeof QueryClientT;
  PersistQueryClientProvider: typeof PersistQueryClientProviderT;
  QueryClientProvider: typeof QueryClientProviderT;
  notifyManager: typeof notifyManagerT;
  useMutation: typeof useMutationT;
  useQuery: typeof useQueryT;
  useQueryClient: typeof useQueryClientT;
  useSuspenseQuery: typeof useSuspenseQueryT;
  useInfiniteQuery: typeof useInfiniteQueryT;
  useIsFetching: typeof useIsFetchingT;
  useIsMutating: typeof useIsMutatingT;
};

const QUERY_CLIENT_METHODS = [
  "mount",
  "unmount",
  "defaultQueryOptions",
  "defaultMutationOptions",
  "getQueryCache",
  "getMutationCache"
] as const;
const QUERY_CLIENT_PROVIDER_MARKERS = ["client", "children", "mount", "unmount"] as const;
const PERSIST_PROVIDER_MARKERS = [
  "persistOptions",
  "restoreClient",
  "persistClient",
  "removeClient"
] as const;
const PERSIST_FIBER_MARKERS = [
  "persistOptions",
  "queryClient",
  "getQueryCache",
  "getMutationCache"
] as const;
const MUTATION_HOOK_MARKERS = ["useSyncExternalStore", "mutateAsync", "throwOnError"] as const;
const SUSPENSE_QUERY_MARKERS = ["throwOnError", "suspense", "enabled"] as const;
const REACT_FIBER_PREFIXES = ["__reactFiber$", "__reactContainer$"] as const;

const hasMarkers = (source: string, markers: readonly string[]): boolean =>
  markers.every((marker) => source.includes(marker));

const isFunction = (value: any): value is Function => typeof value === "function";

const hasFunctions = (value: any, names: readonly string[]): boolean =>
  names.every((name) => typeof value?.[name] === "function");

function isQueryClient(value: any): boolean {
  return isFunction(value) && hasFunctions(value.prototype, QUERY_CLIENT_METHODS);
}

function isQueryClientInstance(value: any): boolean {
  return hasFunctions(value, QUERY_CLIENT_METHODS);
}

function isQueryClientProvider(value: any): boolean {
  if (!isFunction(value)) {
    return false;
  }

  const source = sourceOf(value);
  return (
    hasMarkers(source, QUERY_CLIENT_PROVIDER_MARKERS) &&
    !source.includes("No QueryClient set") &&
    !source.includes("defaultQueryOptions")
  );
}

function isPersistQueryClientProvider(value: any, props: any): boolean {
  if (!isFunction(value)) {
    return false;
  }

  if (props?.persistOptions !== undefined && isQueryClientInstance(props.client)) {
    return true;
  }

  const source = sourceOf(value);
  return hasMarkers(source, PERSIST_PROVIDER_MARKERS) || hasMarkers(source, PERSIST_FIBER_MARKERS);
}

function isUseQueryClient(value: any): boolean {
  if (!isFunction(value) || isQueryClientProvider(value)) {
    return false;
  }

  const source = sourceOf(value);
  return source.includes("No QueryClient set") || hasMarkers(source, ["useContext", "QueryClient"]);
}

function isUseMutation(value: any): boolean {
  return isFunction(value) && hasMarkers(sourceOf(value), MUTATION_HOOK_MARKERS);
}

const USE_QUERY_REGEX =
  /^function [a-zA-Z_$][\w$]*\(([a-zA-Z_$][\w$]*),([a-zA-Z_$][\w$]*)\)\{return\(0,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\)\(\1,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*,\2\)\}$/;

interface FiberValues {
  QueryClient: any;
  QueryClientProvider: any;
  PersistQueryClientProvider: any;
}

function getFiber(element: Element): any {
  for (const key of Object.keys(element)) {
    if (REACT_FIBER_PREFIXES.some((prefix) => key.startsWith(prefix))) {
      return (element as any)[key];
    }
  }

  return undefined;
}

function findReactQueryFiberValues(): FiberValues {
  if (typeof document === "undefined") {
    return {
      QueryClient: undefined,
      QueryClientProvider: undefined,
      PersistQueryClientProvider: undefined
    };
  }

  const values: FiberValues = {
    QueryClient: undefined,
    QueryClientProvider: undefined,
    PersistQueryClientProvider: undefined
  };
  const seen = new Set<any>();
  const stack: any[] = [];

  for (const element of document.querySelectorAll("*")) {
    const fiber = getFiber(element);

    if (fiber !== undefined) {
      stack.push(fiber);
    }
  }

  while (stack.length > 0) {
    const fiber = stack.pop();

    if (fiber === undefined || seen.has(fiber)) {
      continue;
    }

    seen.add(fiber);

    const props = fiber?.memoizedProps ?? fiber?.pendingProps;
    const type = fiber?.type ?? fiber?.elementType;
    const client = props?.client ?? props?.value;
    const queryClientConstructor = client?.constructor;

    if (values.QueryClient === undefined && isQueryClient(queryClientConstructor)) {
      values.QueryClient = queryClientConstructor;
    }
    if (values.QueryClientProvider === undefined && isQueryClientProvider(type)) {
      values.QueryClientProvider = type;
    }
    if (
      values.PersistQueryClientProvider === undefined &&
      isPersistQueryClientProvider(type, props)
    ) {
      values.PersistQueryClientProvider = type;
    }

    if (fiber.child !== null) {
      stack.push(fiber.child);
    }
    if (fiber.sibling !== null) {
      stack.push(fiber.sibling);
    }
  }

  return values;
}

function findUseInfiniteQuery(): any {
  const modules = webpackRequire?.m;
  if (!modules) {
    return undefined;
  }

  for (const id of Object.keys(modules)) {
    const source = sourceOf(modules[id]);
    if (!source.includes("fetchPreviousPage") || !source.includes("getOptimisticResult")) {
      continue;
    }

    try {
      const exports = webpackRequire?.(id);
      const hook = Object.values(exports ?? {}).find((value) => typeof value === "function");
      if (hook !== undefined) {
        return hook;
      }
    } catch (error) {
      console.warn("[std:reactQuery] failed to execute useInfiniteQuery module", id, error);
    }
  }

  return undefined;
}

interface ModuleInventory {
  cache: any[];
  modules: any[];
  functionModules: Array<(...args: any[]) => any>;
}

interface RefreshData {
  inv: ModuleInventory;
  fiber: FiberValues;
}

const moduleExports: any[] = [];

function getModuleInventory(): ModuleInventory {
  const factories = new Set(Object.values(webpackRequire?.m ?? {}));
  const modules = moduleExports.flatMap((exports) =>
    typeof exports === "object" && exports !== null ? Object.values(exports) : []
  );
  const functionModules = modules.flatMap((value) => {
    if (typeof value === "function") {
      return [value];
    }

    if (typeof value !== "object" || value === null) {
      return [];
    }

    return Object.values(value).filter(
      (inner) => typeof inner === "function" && !factories.has(inner)
    );
  });

  return { cache: moduleExports, modules, functionModules };
}

const refreshListeners = new Set<(data: RefreshData) => void>();
let refreshScheduled = false;

function runRefresh(): void {
  refreshScheduled = false;

  const data: RefreshData = {
    inv: getModuleInventory(),
    fiber: findReactQueryFiberValues()
  };

  for (const listener of [...refreshListeners]) {
    listener(data);
  }
}

function scheduleRefresh(): void {
  if (refreshListeners.size === 0) {
    return;
  }

  if (refreshScheduled) {
    return;
  }

  refreshScheduled = true;
  queueMicrotask(runRefresh);
}

moduleExecutedSubject.subscribe(([, exports]) => {
  moduleExports.push(exports);
  scheduleRefresh();
});

function resolveMember<T>(
  name: string,
  strategy: string,
  find: (data: RefreshData) => T | undefined
): Promise<T> {
  return new Promise((resolve) => {
    const resolveAttempt = (data: RefreshData): void => {
      let value: T | undefined;

      try {
        value = find(data);
      } catch (error) {
        console.warn(`[std:reactQuery] member "${name}" resolution failed`, error);
        return;
      }

      if (value === undefined) {
        return;
      }

      refreshListeners.delete(resolveAttempt);
      console.info(`[std:reactQuery] member "${name}" resolved via ${strategy}`);
      resolve(value);
    };

    refreshListeners.add(resolveAttempt);
    scheduleRefresh();
  });
}

export const ReactQuery = createApi<ReactQueryApi>({
  QueryClient: resolveMember<typeof QueryClientT>(
    "QueryClient",
    "fiber QueryClient constructor",
    ({ fiber }) => (isQueryClient(fiber.QueryClient) ? fiber.QueryClient : undefined)
  ),
  PersistQueryClientProvider: resolveMember<typeof PersistQueryClientProviderT>(
    "PersistQueryClientProvider",
    "fiber PersistQueryClientProvider",
    ({ fiber }) =>
      isPersistQueryClientProvider(fiber.PersistQueryClientProvider, undefined)
        ? fiber.PersistQueryClientProvider
        : undefined
  ),
  QueryClientProvider: resolveMember<typeof QueryClientProviderT>(
    "QueryClientProvider",
    "fiber QueryClientProvider",
    ({ fiber }) =>
      isQueryClientProvider(fiber.QueryClientProvider) ? fiber.QueryClientProvider : undefined
  ),
  notifyManager: resolveMember<typeof notifyManagerT>(
    "notifyManager",
    "module setBatchNotifyFunction",
    ({ inv }) => inv.modules.find((module) => module?.setBatchNotifyFunction)
  ),
  useMutation: resolveMember<typeof useMutationT>(
    "useMutation",
    "functionModule isUseMutation",
    ({ inv }) => inv.functionModules.find(isUseMutation)
  ),
  useQuery: resolveMember<typeof useQueryT>(
    "useQuery",
    "functionModule USE_QUERY_REGEX",
    ({ inv }) => inv.functionModules.find((module) => sourceOf(module).match(USE_QUERY_REGEX))
  ),
  useQueryClient: resolveMember<typeof useQueryClientT>(
    "useQueryClient",
    "functionModule isUseQueryClient",
    ({ inv }) => inv.functionModules.find(isUseQueryClient)
  ),
  useSuspenseQuery: resolveMember<typeof useSuspenseQueryT>(
    "useSuspenseQuery",
    "functionModule SUSPENSE_QUERY_MARKERS",
    ({ inv }) =>
      inv.functionModules.find((module) => hasMarkers(sourceOf(module), SUSPENSE_QUERY_MARKERS))
  ),
  useInfiniteQuery: resolveMember<typeof useInfiniteQueryT>(
    "useInfiniteQuery",
    "factory scan (webpackRequire.m)",
    () => findUseInfiniteQuery()
  ),
  useIsFetching: resolve(byCode({ matches: ["isFetching", "useSyncExternalStore"], mode: "all" })),
  useIsMutating: resolve(byCode({ matches: ["isMutating", "useSyncExternalStore"], mode: "all" }))
});
