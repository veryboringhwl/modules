import { startEventHandlers } from "./api/events.ts";

export default async () => {
  await Promise.all([
    import("./api/index.ts"),
    import("./libs/index.ts"),
    import("./components/index.ts")
  ]);

  return startEventHandlers();
};
