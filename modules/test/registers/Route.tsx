import { ReactRouter } from "/modules/std/libs/index.ts";

import { EncoreComponentPage } from "../page/EncoreComponentPage.tsx";
import { HomePage } from "../page/HomePage.tsx";
import { ReactComponentPage } from "../page/ReactComponentPage.tsx";

export function TestRoute() {
  return (
    <div className="test-page contentSpacing" id="TestPageID">
      <ReactRouter.Routes>
        <ReactRouter.Route element={<HomePage />} path="/" />
        <ReactRouter.Route element={<ReactComponentPage />} path="/ReactComponent" />
        <ReactRouter.Route element={<EncoreComponentPage />} path="/EncoreComponent" />
      </ReactRouter.Routes>
    </div>
  );
}
