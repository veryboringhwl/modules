import { MenuItem, MenuItemSubMenu } from "/modules/stdlib/src/webpack/ReactComponents.ts";

import { logger } from "../load.tsx";

export const TestMenu = () => {
  return (
    <MenuItemSubMenu depth={1} displayText="Stdlib diagnostics" placement="right-start">
      <MenuItem divider="before" onClick={() => logger.info("Nested MenuItem")}>
        Open diagnostics modal
      </MenuItem>
      <MenuItem onClick={() => logger.info("MenuItem")}>Open /test from nav link</MenuItem>
    </MenuItemSubMenu>
  );
};
