import {
  byCode,
  byProps,
  byFactorySource,
  resolveInto,
  resolveIntoModule
} from "../core/webpack.ts";

import type {
  notifyManager as notifyManagerT,
  QueryClientProvider as QueryClientProviderT,
  QueryClient as QueryClientT,
  useInfiniteQuery as useInfiniteQueryT,
  useMutation as useMutationT,
  useQueryClient as useQueryClientT,
  useQuery as useQueryT,
  useSuspenseQuery as useSuspenseQueryT
} from "npm:@tanstack/react-query";

export const ReactQuery = {
  QueryClient: undefined as unknown as typeof QueryClientT,
  PersistQueryClientProvider: undefined as any,
  QueryClientProvider: undefined as unknown as typeof QueryClientProviderT,
  notifyManager: undefined as unknown as typeof notifyManagerT,
  useMutation: undefined as unknown as typeof useMutationT,
  useQuery: undefined as unknown as typeof useQueryT,
  useQueryClient: undefined as unknown as typeof useQueryClientT,
  useSuspenseQuery: undefined as unknown as typeof useSuspenseQueryT,
  useInfiniteQuery: undefined as unknown as typeof useInfiniteQueryT
};

resolveInto<typeof QueryClientT>(byCode("defaultMutationOptions"), (value) => {
  ReactQuery.QueryClient = value;
});

resolveInto<any>(byCode("persistOptions"), (value) => {
  ReactQuery.PersistQueryClientProvider = value;
});

resolveInto<typeof QueryClientProviderT>(byCode("use QueryClientProvider"), (value) => {
  ReactQuery.QueryClientProvider = value;
});

resolveInto<typeof notifyManagerT>(byProps("setBatchNotifyFunction"), (value) => {
  ReactQuery.notifyManager = value;
});

resolveInto<typeof useMutationT>(byCode("mutateAsync"), (value) => {
  ReactQuery.useMutation = value;
});

resolveInto<typeof useQueryT>(
  byCode(
    /^function [a-zA-Z_$][\w$]*\(([a-zA-Z_$][\w$]*),([a-zA-Z_$][\w$]*)\)\{return\(0,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\)\(\1,[a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*,\2\)\}$/
  ),
  (value) => {
    ReactQuery.useQuery = value;
  }
);

resolveInto<typeof useQueryClientT>(
  byCode({ matches: ["client", "Provider", "mount"], mode: "all" }),
  (value) => {
    ReactQuery.useQueryClient = value;
  }
);

resolveInto<typeof useSuspenseQueryT>(
  byCode({ matches: ["throwOnError", "suspense", "enabled", "placeholderData"], mode: "all" }),
  (value) => {
    ReactQuery.useSuspenseQuery = value;
  }
);

resolveIntoModule(
  byFactorySource({ matches: ["fetchPreviousPage", "getOptimisticResult"], mode: "all" }),
  (exports) => {
    const fn = Object.values(exports).find((m) => typeof m === "function");
    if (fn) {
      ReactQuery.useInfiniteQuery = fn as typeof useInfiniteQueryT;
    }
  }
);
