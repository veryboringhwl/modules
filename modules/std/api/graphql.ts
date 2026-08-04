import { createApi, resolve } from "../core/expose.ts";
import { transformer } from "../core/transformer.ts";
import { byCode } from "../core/webpack.ts";
import { Platform } from "./platform.ts";

export type GraphQLOp = "query" | "mutation";
export type GraphQLDef<N extends string, O extends GraphQLOp> = {
  name: N;
  operation: O;
  sha256Hash: string;
  value: null;
};
export type GraphQLDefs = {
  [O in GraphQLOp]: { [N in string]: GraphQLDef<N, O> };
};

export const GraphQLDefs = {
  query: {},
  mutation: {}
} as GraphQLDefs;

transformer(
  (emit) => (str) => {
    emit();

    const matches = str.matchAll(
      /(=new [a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*\("(?<name>\w+)","(?<operation>query|mutation)","(?<sha256Hash>[\w\d]{64})",null\))/g
    );
    for (const match of matches) {
      const { groups } = match;
      if (!groups) continue;
      const { name, operation, sha256Hash } = groups;
      // @ts-expect-error
      GraphQLDefs[operation][name] = {
        name,
        operation,
        sha256Hash,
        value: null
      };
    }

    return str;
  },
  {
    glob: /.+\.js$/
  }
);

export type GraphQLApi = {
  Request: (query: unknown, variables: unknown) => Promise<unknown>;
  Context: any;
  Handler: any;
};

const graphQL = createApi<Omit<GraphQLApi, "Request">>({
  Context: resolve(byCode({ matches: ["subscription", "mutation"], mode: "all" })),
  Handler: resolve(byCode("GraphQL subscriptions are not supported"))
});

Object.defineProperty(graphQL, "Request", {
  enumerable: true,
  get: () => Platform.getGraphQLLoader()
});

export const GraphQL = graphQL as GraphQLApi;
