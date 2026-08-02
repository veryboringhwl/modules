import { setTransformer } from "./core/transformer.ts";

import type { MixinContext } from "/hooks/module.ts";

export default async (context: MixinContext) => {
  setTransformer(context.transformer);

  await import("./core/wpunpk.mix.ts");
  await import("./core/events.mix.ts");

  await Promise.all([
    import("./core/mod.ts"),
    import("./libs/reduxStore.ts"),
    import("./api/platform.ts"),
    import("./api/graphql.ts"),
    import("./components/settingsSection.ts"),
    import("./components/registers/index.ts")
  ]);
};
