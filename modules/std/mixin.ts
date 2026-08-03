import { setTransformer } from "./core/transformer.ts";

import type { Transformer } from "/hooks/transform.ts";

export default async (transformer: Transformer) => {
  setTransformer(transformer);

  await import("./core/webpackRuntime.ts");

  await Promise.all([
    import("./core/index.ts"),
    import("./libs/reduxStore.ts"),
    import("./api/platform.ts"),
    import("./api/graphql.ts"),
    import("./components/settingsSection.ts"),
    import("./registers/index.ts")
  ]);
};
