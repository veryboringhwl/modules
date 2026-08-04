import { startEventHandlers } from "./api/events.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export default async (_mod: ModuleInstance) => {
  await Promise.all([
    import("./api/index.ts"),
    import("./libs/index.ts"),
    import("./components/index.ts")
  ]);

  return startEventHandlers();
};
