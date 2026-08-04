import { transformer } from "./transformer.ts";
import { matchModule, resolveInto } from "./webpack.ts";

import type { ExportFilter, ModuleMatcher } from "./webpack.ts";

export interface Resolver<_T> {
  __resolve: ExportFilter;
}

export interface ModuleResolver<_T> {
  __fromModule: ModuleMatcher;
  __select: (exports: any) => _T;
}

export type ApiMember<T> = T | Promise<T> | Resolver<T> | ModuleResolver<T>;

export type ApiSpec<ApiT extends object> = { [K in keyof ApiT]: ApiMember<ApiT[K]> };

export function resolve<T>(filter: ExportFilter): Resolver<T> {
  return { __resolve: filter };
}

export function fromModule<T>(
  matcher: ModuleMatcher,
  select: (exports: any) => T
): ModuleResolver<T> {
  return { __fromModule: matcher, __select: select };
}

export function createApi<ApiT extends object>(spec: ApiSpec<ApiT>): ApiT {
  const api = {} as ApiT;
  const moduleGroups = new Map<ModuleMatcher, Array<[keyof ApiT, (exports: any) => unknown]>>();

  for (const [key, member] of Object.entries(spec) as Array<[keyof ApiT, ApiMember<any>]>) {
    if (isModuleResolver(member)) {
      let group = moduleGroups.get(member.__fromModule);
      if (!group) {
        group = [];
        moduleGroups.set(member.__fromModule, group);
      }
      group.push([key, member.__select]);
      continue;
    }

    if (isResolver(member)) {
      resolveInto(member.__resolve, (value) => {
        (api as Record<keyof ApiT, unknown>)[key] = value;
        console.info(`[std:expose] resolved member "${String(key)}"`);
      });
      continue;
    }

    if (member instanceof Promise) {
      member.then((value) => {
        (api as Record<keyof ApiT, unknown>)[key] = value;
        console.info(`[std:expose] resolved promise member "${String(key)}"`);
      });
      continue;
    }

    (api as Record<keyof ApiT, unknown>)[key] = member;
  }

  for (const [matcher, members] of moduleGroups) {
    matchModule(matcher).then(
      ([id, exports]) => {
        console.info(
          `[std:expose] resolved module group (id ${String(id)}, ${members.length} members)`
        );
        for (const [key, select] of members) {
          (api as Record<keyof ApiT, unknown>)[key] = select(exports);
        }
      },
      (error) => {
        console.warn("[std:expose] module group failed to resolve", error);
      }
    );
  }

  return api;
}

function isResolver<T>(member: ApiMember<T>): member is Resolver<T> {
  return typeof member === "object" && member !== null && "__resolve" in member;
}

function isModuleResolver<T>(member: ApiMember<T>): member is ModuleResolver<T> {
  return typeof member === "object" && member !== null && "__fromModule" in member;
}

export function captureGlobal<T>(
  name: string,
  glob: RegExp,
  rewrite: (source: string, name: string) => string,
  { wait = true }: { wait?: boolean } = {}
): Promise<T> {
  return transformer<T>(
    (emit) => (str) => {
      Object.defineProperty(globalThis, name, { set: emit });
      return rewrite(str, name);
    },
    { glob, wait }
  );
}

export const selectFirstExport = (exports: any): any => Object.values(exports)[0];

export const selectExport =
  (filter: ExportFilter) =>
  (exports: any): any =>
    Object.values(exports).find((value) => filter(value));

export const selectFunctionExport =
  (filter?: ExportFilter) =>
  (exports: any): any =>
    Object.values(exports).find(
      (value) => typeof value === "function" && (filter === undefined || filter(value))
    );

export const selectComponentExport = (exports: any): any =>
  Object.values(exports).find(
    (value) => value && typeof value === "object" && Object.hasOwn(value, "$$typeof")
  );

export const selectAnyExport = (exports: any): any =>
  Object.values(exports).find((value) => typeof value === "function" || typeof value === "object");
