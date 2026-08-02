import type * as reactQuery from "./reactQuery.xpui.ts";

export let QueryClient: typeof reactQuery.QueryClient;
export let PersistQueryClientProvider: typeof reactQuery.PersistQueryClientProvider;
export let QueryClientProvider: typeof reactQuery.QueryClientProvider;
export let notifyManager: typeof reactQuery.notifyManager;
export let useMutation: typeof reactQuery.useMutation;
export let useQuery: typeof reactQuery.useQuery;
export let useQueryClient: typeof reactQuery.useQueryClient;
export let useSuspenseQuery: typeof reactQuery.useSuspenseQuery;
export let useInfiniteQuery: typeof reactQuery.useInfiniteQuery;

import("./reactQuery.xpui.ts").then((m) => {
  QueryClient = m.QueryClient;
  PersistQueryClientProvider = m.PersistQueryClientProvider;
  QueryClientProvider = m.QueryClientProvider;
  notifyManager = m.notifyManager;
  useMutation = m.useMutation;
  useQuery = m.useQuery;
  useQueryClient = m.useQueryClient;
  useSuspenseQuery = m.useSuspenseQuery;
  useInfiniteQuery = m.useInfiniteQuery;
});
