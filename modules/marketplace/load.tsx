import {
  createLogger,
  createRegistrar,
  createSettings,
  createStorage,
  type Settings
} from "/modules/stdlib/mod.ts";
import { React } from "/modules/stdlib/src/expose/React.ts";
import {
  SettingsRow,
  SettingsRowEnd,
  SettingsRowStart,
  SettingsSection
} from "/modules/stdlib/src/expose/SettingsSection.ts";
import { UI } from "/modules/stdlib/src/webpack/ComponentLibrary.ts";
import { Toggle } from "/modules/stdlib/src/webpack/ReactComponents.ts";
import { Route } from "/modules/stdlib/src/webpack/ReactComponents.ts";

import { MarketplaceNavLink } from "./src/shared/components/MarketplaceNavLink.tsx";
import { settingsSchema } from "./src/shared/settings.ts";

import type { ModuleInstance } from "/hooks/module.ts";

export let storage: Storage;
export let logger: Console;
export let settings: Settings<typeof settingsSchema>;

export let module: ModuleInstance;

const MarketplaceSettings: React.FC = () => {
  const { hideCoreModules } = settings.useSettings();
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
            onSelected={() => settings.set("hideCoreModules", !hideCoreModules)}
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
  settings = createSettings(mod, settingsSchema);
  const registrar = createRegistrar(mod);

  const LazyApp = React.lazy(() => import("./src/app/MarketplaceApp.tsx"));
  registrar.register("route", <Route element={<LazyApp />} path={"/spicetify/marketplace/*"} />);

  registrar.register("navlink", <MarketplaceNavLink />);
  registrar.register("settingsSection", <MarketplaceSettings />);
}
