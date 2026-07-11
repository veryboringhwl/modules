import { hotwired, type MixinContext } from "/hooks/module.ts";

const nativeObjectDefineProperty = Object.defineProperty;
Object.defineProperty = (obj, prop, descriptor) => {
  if (prop !== "prototype" && descriptor) {
    descriptor.configurable ??= true;
  }
  return nativeObjectDefineProperty(obj, prop, descriptor);
};

const { promise, transformer, signal } = await hotwired<MixinContext>(import.meta);

export { transformer };

signal.addEventListener("abort", () => {
  Object.defineProperty = nativeObjectDefineProperty;
});

globalThis.Spicetify = {
  Platform: {} as any
};

promise.wrap(
  (async () => {
    await Promise.all([
      import("./src/api/index.ts")
      // import("./src/events.mix.ts"),
      // import("./src/wpunpk.mix.ts")
    ]);
  })()
);
