import { Platform } from "../api/platform.ts";
import {
  selectAnyExport,
  selectComponentExport,
  selectFirstExport,
  selectFunctionExport
} from "../core/expose.ts";
import { findModuleComponent, findModuleComponentByFactory } from "../core/lazyComponent.ts";
import { byCode, byComponentCode, byFactorySource } from "../core/webpack.ts";
import { React } from "../libs/react.ts";

export const Slider = findModuleComponentByFactory(
  byFactorySource("progressBarRef"),
  selectFirstExport
);

export const Toggle = findModuleComponentByFactory(
  byFactorySource("_nD_jYvjV80Rf8sX"),
  selectFirstExport
);

export const TracklistRow = findModuleComponentByFactory(
  byFactorySource('"data-testid":"track-icon"'),
  selectFirstExport
);

export const Cards = {
  Generic: findModuleComponent(
    byCode({
      matches: [
        "OnMouseDown",
        /^[^;]*headerText/,
        /^[^;]*featureIdentifier/,
        /^[^;]*renderCardImage/
      ],
      mode: "all"
    })
  ),
  HeroGeneric: findModuleComponent(byCode("herocard-click-handler")),
  CardImage: findModuleComponent(byCode('"card-image"'))
};

export const Menus = {
  Album: findModuleComponent(byCode(/value:"album"/)),
  PodcastShow: findModuleComponent(byCode(/value:"show"/)),
  Artist: findModuleComponent(byCode(/value:"artist"/)),
  Track: findModuleComponent(byCode(/value:"track"/)),
  Playlist: findModuleComponentByFactory(
    byFactorySource({
      matches: ["isRootlistable", "canAdministratePermissions", "isPublished"],
      mode: "all"
    }),
    selectAnyExport
  )
};

export const Nav = findModuleComponentByFactory(
  byFactorySource({ matches: ["navigationalRoot", "noLink"], mode: "all" }),
  selectFirstExport
);

export const Link = findModuleComponent(byComponentCode("pageId"));

export const ContextMenu = findModuleComponentByFactory(
  byFactorySource("toggleContextMenu"),
  selectFirstExport
);

export const RightClickMenu = findModuleComponent(
  byCode({ matches: ["action", "open", "trigger", "right-click"], mode: "all" })
);

export const Tooltip = findModuleComponent(
  byCode({ matches: ["hover-or-focus", "tooltip"], mode: "all" })
);

export const Menu = findModuleComponent(
  byCode({ matches: ["getInitialFocusElement", "children"], mode: "all" })
);

export const MenuItem = findModuleComponent(
  byCode({ matches: ["handleMouseEnter", "onClick"], mode: "all" })
);

export const MenuItemSubMenu = findModuleComponent(byCode("subMenuIcon"));

export const FilterBox = findModuleComponent(byComponentCode("filterBoxApiRef"));

export const ScrollableContainer = findModuleComponentByFactory(
  byFactorySource({ matches: ["scrollLeft", "showButtons"], mode: "all" }),
  selectComponentExport
);

export const ConfirmDialog = findModuleComponentByFactory(
  byFactorySource("confirm-dialog-description"),
  selectComponentExport
);

export const GenericModal = findModuleComponent(
  byCode({ matches: ["isOpen", "contentLabel", "animated"], mode: "all" })
);

export const Dialog = findModuleComponent(
  byCode({ matches: ["isOpen", "unmountWhenClose"], mode: "all" })
);

export const Tracklist = findModuleComponent(byComponentCode("nrValidItems"));

export const IconWrapper = findModuleComponent(byCode("button__icon-wrapper"));

export const PanelContainer = findModuleComponentByFactory(
  byFactorySource("Desktop_PanelContainer_Id"),
  selectFunctionExport()
);

export const PanelContent = findModuleComponentByFactory(
  byFactorySource("fixedHeader"),
  selectFirstExport
);

export const PanelHeader = findModuleComponentByFactory(
  byFactorySource("PanelHeader_CloseButton"),
  selectFirstExport
);

export const RemoteConfigProviderComponent = findModuleComponent(
  byCode({ matches: ["resolveSuspense", "configuration"], mode: "all" })
);

export const RemoteConfigProvider = ({
  configuration = Platform.getRemoteConfiguration(),
  children
}: {
  configuration?: ReturnType<typeof Platform.getRemoteConfiguration>;
  children?: React.ReactNode;
}) => React.createElement(RemoteConfigProviderComponent, { configuration }, children);

export const TracklistColumnsContextProvider = findModuleComponent(
  byCode({ matches: ["columns", "visibleColumns", "toggleVisible"], mode: "all" })
);
