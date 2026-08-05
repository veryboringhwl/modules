import {
  createLogger,
  createSettings,
  createStorage,
  type Settings
} from "/modules/std/api/index.ts";
import {
  SettingsRow,
  SettingsRowEnd,
  SettingsRowStart,
  SettingsSection,
  Toggle,
  UI
} from "/modules/std/components/index.ts";
import { createRegistrar } from "/modules/std/core/index.ts";
import { React, ReactRouter } from "/modules/std/libs/index.ts";

import { MarketplaceNavLink } from "./src/shared/components/MarketplaceNavLink.tsx";
import { SETTINGS } from "./src/shared/settings.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export let storage: Storage;
export let logger: Console;
export let settings: Settings;

export let module: ModuleInstance;

const MarketplaceSettings: React.FC = () => {
  const hideCoreModules = settings.useSetting(SETTINGS.hideCoreModules, false);
  return (
    <SettingsSection filterMatchQuery="marketplace">
      <UI.Text as="h2" semanticColor="textBase" variant="bodyMediumBold">
        Marketplace
      </UI.Text>
      <SettingsRow>
        <SettingsRowStart>
          <UI.Text as="label" semanticColor="textBase" variant="bodyMediumBold">
            Hide core modules
          </UI.Text>
        </SettingsRowStart>
        <SettingsRowEnd>
          <Toggle
            id="marketplace-hide-core"
            value={hideCoreModules}
            onSelected={() => settings.set(SETTINGS.hideCoreModules, !hideCoreModules)}
          />
        </SettingsRowEnd>
      </SettingsRow>
    </SettingsSection>
  );
};

export default async function (mod: ModuleInstance) {
  module = mod;
  storage = createStorage(mod);
  logger = createLogger(mod);
  settings = createSettings(mod);
  const registrar = createRegistrar(mod);

  const LazyApp = React.lazy(() => import("./src/app/MarketplaceApp.tsx"));
  registrar.register(
    "route",
    <ReactRouter.Route element={<LazyApp />} path={"/spicetify/marketplace/*"} />
  );

  registrar.register("navlink", <MarketplaceNavLink />);
  registrar.register("settingsSection", <MarketplaceSettings />);
}
