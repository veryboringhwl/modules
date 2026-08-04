import { rxjs } from "./deps.ts";

export type WebpackRequire = {
  (id: keyof any): any;
  m: WebpackChunk[1];
  g: typeof globalThis;
};

export type WebpackModule = <This extends {}>(
  this: This,
  module: { id: keyof any; loaded: false; exports: This },
  exports: This,
  require: WebpackRequire
) => void;
export type WebpackModules = Record<keyof any, WebpackModule>;
export type WebpackChunk = [Array<keyof any>, WebpackModules, (wpr: WebpackRequire) => void];

export let webpackRequire: WebpackRequire | undefined;

const webpackRequireResolvers = Promise.withResolvers<WebpackRequire>();
export const webpackRequireReady = webpackRequireResolvers.promise;

const webpackRequireHooks: ((wpr: WebpackRequire) => void)[] = [];

function flushWebpackRequireHooks(wpr: WebpackRequire) {
  const hooks = webpackRequireHooks.splice(0, webpackRequireHooks.length);
  for (const hook of hooks) {
    hook(wpr);
  }
}

export function onWebpackRequireReady(hook: (wpr: WebpackRequire) => void) {
  if (webpackRequire) {
    hook(webpackRequire);
    return;
  }

  webpackRequireHooks.push(hook);
}

declare global {
  var __webpack_require__: WebpackRequire | undefined;
  var webpackChunkclient_web: WebpackChunk[];
}

export const moduleDefinedSubject = new rxjs.Subject<[keyof any, WebpackModule]>();
export const moduleExecutedSubject = new rxjs.ReplaySubject<[keyof any, any]>();

export const WRAPPED_FACTORY = Symbol("std.wrapped.factory");

function wrapFactory(id: keyof any, factory: WebpackModule): WebpackModule {
  if ((factory as any)[WRAPPED_FACTORY]) {
    return factory;
  }

  const wrapped = function (
    this: unknown,
    module: { id: keyof any; loaded: false; exports: unknown },
    exports: unknown,
    require: WebpackRequire
  ) {
    const result = (factory as Function).call(this, module, exports, require);
    try {
      moduleExecutedSubject.next([id, module.exports]);
    } catch (error) {
      console.warn("[std:webpack] module executed subscriber error", id, error);
    }
    return result;
  } as WebpackModule;
  (wrapped as any)[WRAPPED_FACTORY] = true;
  wrapped.toString = factory.toString.bind(factory);
  return wrapped;
}

function wrapChunkFactories(modules: WebpackModules): Array<[keyof any, WebpackModule]> {
  const defined: Array<[keyof any, WebpackModule]> = [];

  for (const [id, factory] of Object.entries(modules)) {
    if (typeof factory !== "function" || (factory as any)[WRAPPED_FACTORY]) {
      continue;
    }

    modules[id] = wrapFactory(id, factory);
    defined.push([id, factory]);
  }

  return defined;
}

function emitDefined(defined: Array<[keyof any, WebpackModule]>) {
  for (const [id, factory] of defined) {
    try {
      moduleDefinedSubject.next([id, factory]);
    } catch (error) {
      console.warn("[std:webpack] module defined subscriber error", id, error);
    }
  }
}

function wrapAllDefined(wpr: WebpackRequire): number {
  const defined = wrapChunkFactories(wpr.m);
  emitDefined(defined);
  return defined.length;
}

const sweptModuleIds = new Set<keyof any>();

function sweepLoadedModules(wpr: WebpackRequire): number {
  const cache = (wpr as any).c as
    | Record<keyof any, { loaded: boolean; exports: unknown }>
    | undefined;
  let count = 0;

  for (const [id, record] of Object.entries(cache ?? {})) {
    if (!record?.loaded || sweptModuleIds.has(id)) {
      continue;
    }

    sweptModuleIds.add(id);
    moduleExecutedSubject.next([id, record.exports]);
    count++;
  }

  return count;
}

function setWebpackRequire(wpr: WebpackRequire) {
  if (wpr === webpackRequire) {
    return;
  }

  webpackRequire = wpr;
  globalThis.__webpack_require__ = wpr;

  const wrapped = wrapAllDefined(wpr);
  const swept = sweepLoadedModules(wpr);

  console.info(
    `[std:webpack] webpackRequire initialized (${Object.keys(wpr.m).length} factories, wrapped ${wrapped}, swept ${swept} loaded)`
  );

  webpackRequireResolvers.resolve(wpr);
  flushWebpackRequireHooks(wpr);
}

if (globalThis.__webpack_require__) {
  setWebpackRequire(globalThis.__webpack_require__);
}

const CHUNK_QUEUE_NAMES = ["webpackChunkclient_web", "rspackChunkclient_web"] as const;

const patchedQueues = new WeakSet<object>();

function seedSyntheticChunk(queue: any) {
  if (webpackRequire) {
    return;
  }

  queue.push([
    [Symbol.for("std.webpack.chunk.id")],
    {},
    ($: WebpackRequire) => {
      console.info("[std:webpack] synthetic chunk processed");
      setWebpackRequire($);
    }
  ]);
}

function patchChunk(chunk: any) {
  if (!chunk?.[1] || typeof chunk[1] !== "object") {
    return [];
  }

  const defined = wrapChunkFactories(chunk[1]);
  if (defined.length > 0) {
    console.info(`[std:webpack] patched ${defined.length} factories from chunk`);
  }
  return defined;
}

function patchQueuePush(queue: any) {
  if (!queue?.push || patchedQueues.has(queue)) {
    return;
  }

  patchedQueues.add(queue);

  function handlePush(chunk: any) {
    let defined: Array<[keyof any, WebpackModule]> = [];

    try {
      defined = patchChunk(chunk);
    } catch (error) {
      console.warn("[std:webpack] error patching pushed chunk", error);
    }

    const result = handlePush.$$.call(queue, chunk);

    emitDefined(defined);

    return result;
  }

  handlePush.$$ = queue.push;
  handlePush.toString = handlePush.$$.toString.bind(handlePush.$$);
  handlePush.bind = (...args: unknown[]) => handlePush.$$.bind(...args);

  Object.defineProperty(queue, "push", {
    configurable: true,
    get: () => handlePush,
    set(push) {
      handlePush.$$ = push;
    }
  });

  queue.forEach = (fn: (chunk: any) => void) => {
    Array.prototype.forEach.call(queue, (chunk) => {
      let defined: Array<[keyof any, WebpackModule]> = [];

      try {
        defined = patchChunk(chunk);
      } catch (error) {
        console.warn("[std:webpack] error patching initial chunk", error);
      }

      fn(chunk);

      emitDefined(defined);
    });
  };

  console.info("[std:webpack] patched chunk queue");

  seedSyntheticChunk(queue);
}

for (const name of CHUNK_QUEUE_NAMES) {
  const existing = (globalThis as any)[name];
  if (existing) {
    patchQueuePush(existing);
  }

  let chunk: any;
  Object.defineProperty(globalThis, name, {
    configurable: true,
    get: () => chunk,
    set(value) {
      chunk = value;
      if (value?.push) {
        patchQueuePush(value);
      }
    }
  });
}
