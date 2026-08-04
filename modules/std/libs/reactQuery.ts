import { createApi, fromModule, resolve, selectFunctionExport } from "../core/expose.ts";
import { byCode, byFactorySource, byProps } from "../core/webpack.ts";

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
} from "npm:@tanstack/react-query";
import type { PersistQueryClientProvider as PersistQueryClientProviderT } from "npm:@tanstack/react-query-persist-client";

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

export const ReactQuery = createApi<ReactQueryApi>({
  QueryClient: resolve(byCode("defaultMutationOptions")),
  PersistQueryClientProvider: resolve(byCode("persistOptions")),
  QueryClientProvider: resolve(byCode("use QueryClientProvider")),
  notifyManager: resolve(byProps("setBatchNotifyFunction")),
  useMutation: resolve(byCode("mutateAsync")),
  useQuery: resolve(
    byCode(
      /^function [a-zA-Z_$][\w$]*\(([a-zA-Z_$][\w$]*),([a-zA-Z_$][\w$]*)\)\{return\(0,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\)\(\1,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*,\2\)\}$/
    )
  ),
  useQueryClient: resolve(byCode({ matches: ["client", "Provider", "mount"], mode: "all" })),
  useSuspenseQuery: resolve(
    byCode({ matches: ["throwOnError", "suspense", "enabled", "placeholderData"], mode: "all" })
  ),
  useInfiniteQuery: fromModule(
    byFactorySource({ matches: ["fetchPreviousPage", "getOptimisticResult"], mode: "all" }),
    selectFunctionExport()
  ),
  useIsFetching: resolve(byCode({ matches: ["isFetching", "useSyncExternalStore"], mode: "all" })),
  useIsMutating: resolve(byCode({ matches: ["isMutating", "useSyncExternalStore"], mode: "all" }))
});
