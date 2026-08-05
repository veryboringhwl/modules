import { NavLink } from "/modules/std/registers/index.ts";

import { MarketplaceActiveIcon, MarketplaceIcon } from "../icons/MarketplaceIcon.tsx";

export const MarketplaceNavLink = () => {
  return (
    <NavLink
      activeIcon={<MarketplaceActiveIcon />}
      appRoutePath="/spicetify/marketplace/"
      icon={<MarketplaceIcon />}
      localizedApp="Marketplace"
    />
  );
};
