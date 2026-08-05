import { createLogger } from "/modules/std/api/index.ts";
import { Platform } from "/modules/std/api/index.ts";
import { createRegistrar } from "/modules/std/core/index.ts";
import { React, ReactRouter } from "/modules/std/libs/index.ts";

import {
  TestMenu,
  TestNavLink,
  // TestPanel,
  TestPlaybarButton,
  TestPlaybarWidget,
  TestSettingsSection,
  TestTopbarLeftButton,
  TestTopbarRightButton
} from "./registers/index.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export let module: ModuleInstance;
export let hash: { state: string; event: string } | undefined;
export let logger: Console;
export default function (mod: ModuleInstance) {
  module = mod;
  const registrar = createRegistrar(mod);
  logger = createLogger(mod);
  registrar.register("topbarLeftButton", <TestTopbarLeftButton />);
  registrar.register("topbarRightButton", <TestTopbarRightButton />);
  registrar.register("playbarButton", <TestPlaybarButton />);
  registrar.register("playbarWidget", <TestPlaybarWidget />);
  const LazyTestRoute = React.lazy(async () => {
    const { TestRoute } = await import("./registers/Route.tsx");
    return { default: TestRoute };
  });
  // use /spicetify/ to remove topbar but can still use normal if wanted
  registrar.register(
    "route",
    <ReactRouter.Route element={<LazyTestRoute />} path="/spicetify/test/*" />
  );
  registrar.register("navlink", <TestNavLink />);
  registrar.register("menu", <TestMenu />);
  registrar.register("settingsSection", <TestSettingsSection />);
  // registrar.register("panel", <TestPanel />);

  // cool experimental features ive found
  configureExpFeatures();
}

const configureExpFeatures = async () => {
  const overrides = {
    enableShareDialog: true,
    enableYlxMultiSelect: true,
    enableDebugTools: true
  };

  const RemoteConfigDebugAPI = Platform.getRemoteConfigDebugAPI();
  for (const [key, value] of Object.entries(overrides)) {
    await RemoteConfigDebugAPI.setOverride({ source: "web", type: "boolean", name: key }, value);
  }
};
