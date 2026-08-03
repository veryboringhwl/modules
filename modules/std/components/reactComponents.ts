import { Platform } from "../api/platform.ts";
import { findModuleComponent, findModuleComponentByFactory } from "../core/lazyComponent.ts";
import { byCode, byComponentCode, byFactorySource } from "../core/webpack.ts";
import { React } from "../libs/react.ts";

const firstExport = (exports: any) => Object.values(exports)[0];
const firstFunction = (exports: any) => Object.values(exports).find((m) => typeof m === "function");
const firstComponent = (exports: any) =>
  Object.values(exports).find((m) => m && typeof m === "object" && Object.hasOwn(m, "$$typeof"));
const firstFunctionOrObject = (exports: any) =>
  Object.values(exports).find((m) => typeof m === "function" || typeof m === "object");

export const Slider = findModuleComponentByFactory(byFactorySource("progressBarRef"), firstExport);

export const Toggle = findModuleComponentByFactory(
  byFactorySource("_nD_jYvjV80Rf8sX"),
  firstExport
);

export const TracklistRow = findModuleComponentByFactory(
  byFactorySource('"data-testid":"track-icon"'),
  firstExport
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
    firstFunctionOrObject
  )
};

export const Nav = findModuleComponentByFactory(
  byFactorySource({ matches: ["navigationalRoot", "noLink"], mode: "all" }),
  firstExport
);

export const Link = findModuleComponent(byComponentCode("pageId"));

export const ContextMenu = findModuleComponentByFactory(
  byFactorySource("toggleContextMenu"),
  firstExport
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
  firstComponent
);

export const ConfirmDialog = findModuleComponentByFactory(
  byFactorySource("confirm-dialog-description"),
  firstComponent
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
  firstFunction
);

export const PanelContent = findModuleComponentByFactory(
  byFactorySource("fixedHeader"),
  firstExport
);

export const PanelHeader = findModuleComponentByFactory(
  byFactorySource("PanelHeader_CloseButton"),
  firstExport
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
