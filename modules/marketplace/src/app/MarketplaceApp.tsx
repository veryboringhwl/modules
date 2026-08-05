import { ReactRouter } from "/modules/std/libs/index.ts";

import { MarketplacePage } from "../features/catalog/components/MarketplacePage.tsx";
import { ModulePage } from "../features/module/components/ModulePage.tsx";

export default function MarketplaceApp() {
  return (
    <div className="marketplace-app" id="marketplace">
      <ReactRouter.Routes>
        <ReactRouter.Route element={<MarketplacePage />} path="/" />
        <ReactRouter.Route element={<ModulePage />} path="/module/:aurl" />
        <ReactRouter.Route element={<MarketplacePage />} path="*" />
      </ReactRouter.Routes>
    </div>
  );
}
