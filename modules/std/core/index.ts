export { signal } from "./signal.ts";
export { transformer, setTransformer } from "./transformer.ts";
export { Registry, registries, registerRegistry } from "./registry.ts";
export { Registrar, createRegistrar } from "./registrar.ts";
export { findModuleComponent, findModuleComponentByFactory } from "./lazyComponent.ts";
export type { LazyComponent } from "./lazyComponent.ts";
export { captureGlobal, createApi, fromModule, resolve } from "./expose.ts";
export type { ApiMember, ApiSpec, ModuleResolver, Resolver } from "./expose.ts";
export {
  selectAnyExport,
  selectComponentExport,
  selectExport,
  selectFirstExport,
  selectFunctionExport
} from "./expose.ts";
export {
  byCode,
  byComponentCode,
  byEncoreName,
  byFactorySource,
  byProps,
  findAllModuleExports,
  findModule,
  findModuleByExport,
  findModuleByExportSync,
  findModuleExport,
  getModuleExport,
  matchModule,
  matchModuleSync,
  matchModuleSyncAll,
  resolveInto,
  resolveIntoModule,
  resolveIntoSource,
  shouldIgnoreModule,
  shouldIgnoreValue,
  sourceOf,
  srcMatches
} from "./webpack.ts";
export type { AnyMatch, ExportFilter, Match, ModuleMatcher } from "./webpack.ts";
export {
  webpackRequire,
  webpackRequireReady,
  onWebpackRequireReady,
  moduleDefinedSubject,
  moduleExecutedSubject
} from "./webpackRuntime.ts";
export type {
  WebpackChunk,
  WebpackModule,
  WebpackModules,
  WebpackRequire
} from "./webpackRuntime.ts";
