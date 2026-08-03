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

export let webpackRequire: WebpackRequire;

const webpackRequireResolvers = Promise.withResolvers<WebpackRequire>();
export const webpackRequireReady = webpackRequireResolvers.promise;

const webpackRequireHooks: ((wpr: WebpackRequire) => void)[] = [];

function flushWebpackRequireHooks(wpr: WebpackRequire) {
  const hooks = webpackRequireHooks.splice(0, webpackRequireHooks.length);
  for (const hook of hooks) {
    hook(wpr);
  }
}

function setWebpackRequire(wpr: WebpackRequire) {
  webpackRequire = wpr;
  globalThis.__webpack_require__ = wpr;
  webpackRequireResolvers.resolve(wpr);
  flushWebpackRequireHooks(wpr);
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

const webpackChunkclient_web = [
  [
    [Symbol.for("spicetify.webpack.chunk.id")],
    {},
    ($: WebpackRequire) => {
      setWebpackRequire($);
    }
  ] as WebpackChunk
];

if (globalThis.__webpack_require__) {
  setWebpackRequire(globalThis.__webpack_require__);
}

globalThis.webpackChunkclient_web = webpackChunkclient_web;

import { assertEquals } from "/hooks/std/assert.ts";

import { rxjs } from "./deps.ts";

export const moduleDefinedSubject = new rxjs.Subject<[keyof any, WebpackModule]>();
export const moduleExecutedSubject = new rxjs.ReplaySubject<[keyof any, any]>();

const WRAPPED_FACTORY = Symbol("std.wrapped.factory");

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

function wrapAllDefined(): void {
  if (!webpackRequire) {
    return;
  }

  for (const [id, factory] of Object.entries(webpackRequire.m)) {
    if (typeof factory !== "function") {
      continue;
    }
    webpackRequire.m[id] = wrapFactory(id, factory);
  }
}

onWebpackRequireReady(wrapAllDefined);

function trap(fn: (chunk: WebpackChunk) => void) {
  return (chunk: WebpackChunk) => {
    const [, moreModules] = chunk;
    const rawModules: Array<[keyof any, WebpackModule]> = [];
    for (const [id, factory] of Object.entries(moreModules)) {
      if (typeof factory !== "function") {
        continue;
      }
      rawModules.push([id, factory]);
      moreModules[id] = wrapFactory(id, factory);
    }

    fn(chunk);

    for (const [id, factory] of rawModules) {
      try {
        moduleDefinedSubject.next([id, factory]);
      } catch (error) {
        console.warn("[std:webpack] module defined subscriber error", id, error);
      }
    }
  };
}

// @ts-expect-error
webpackChunkclient_web.forEach = (fn: (chunk: WebpackChunk) => void) => {
  const trappedFn = trap(fn);

  Array.prototype.forEach.call(webpackChunkclient_web, (chunk, index) => {
    if (index === 0) {
      assertEquals(chunk[0], [Symbol.for("spicetify.webpack.chunk.id")]);

      fn(chunk);

      return;
    }

    trappedFn(chunk);
  });
};

globalThis.webpackChunkclient_web = new Proxy(webpackChunkclient_web, {
  set(target, p, newValue, receiver) {
    if (p !== "push") {
      return Reflect.set(target, p, newValue, receiver);
    }

    const push = function () {
      const args = Array.prototype.slice.call(arguments);
      for (const chunk of args) {
        trap(newValue)(chunk);
      }
    };

    return Reflect.set(target, p, push, receiver);
  }
});
