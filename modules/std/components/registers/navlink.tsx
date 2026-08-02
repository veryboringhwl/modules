import { Platform } from "../../api/platform.ts";
import { Registry, registerRegistry } from "../../core/registry.ts";
import { transformer } from "../../core/transformer.ts";
import { classnames } from "../../libs/classNames.ts";
import { React } from "../../libs/react.ts";
import { UI } from "../componentLibrary.ts";
import { ScrollableContainer, Tooltip } from "../reactComponents.ts";

const registry = new (class extends Registry<React.ReactNode> {
  override add(value: React.ReactNode): this {
    refresh?.();
    return super.add(value);
  }

  override delete(value: React.ReactNode): boolean {
    refresh?.();
    return super.delete(value);
  }
})();
registerRegistry("navlink", registry);

let refresh: React.DispatchWithoutAction | undefined;

declare global {
  var __renderNavLinks: () => React.ReactNode;
}

globalThis.__renderNavLinks = () =>
  React.createElement(() => {
    [, refresh] = React.useReducer((n) => n + 1, 0);

    return (
      <ScrollableContainer className="navlinks-scrollable_container" onlyHorizontalWheel>
        {registry.all()}
      </ScrollableContainer>
    );
  });

transformer(
  (emit) => (str) => {
    str = str.replace(
      /("spotify:app:home"[\s\S]*?,[a-zA-Z_$][\w$]*=\(\{children:([a-zA-Z_$][\w$]*)\}\)=>[^}]*?,children:)\2/,
      "$1[$2,__renderNavLinks()]"
    );

    emit();
    return str;
  },
  {
    glob: /^\/xpui-snapshot\.js/
  }
);

export type NavLinkProps = {
  localizedApp: string;
  appRoutePath: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

export const NavLink: React.FC<NavLinkProps> = ({
  localizedApp,
  appRoutePath,
  icon,
  activeIcon
}) => {
  const History = Platform.getHistory();
  const [currentPathname, setCurrentPathname] = React.useState(History.location.pathname);

  const isActive =
    currentPathname === appRoutePath || currentPathname.startsWith(`${appRoutePath}/`);
  const currentIcon = isActive ? activeIcon : icon;

  React.useEffect(() => {
    const unlisten = History.listen(({ pathname }: { pathname: string }) => {
      setCurrentPathname(pathname);
    }) as () => void;

    return unlisten;
  }, [History]);

  return (
    <Tooltip label={localizedApp}>
      <UI.ButtonTertiary
        aria-label={localizedApp}
        className={classnames("_Bg_zSvFrEutyacG kUHE42xvQVzWqabl uBpmNFia37U4nzmX", {
          kxv3By32Og8yDEXy: isActive
        })}
        iconOnly={(props) =>
          React.isValidElement(currentIcon) ? React.cloneElement(currentIcon, props) : null
        }
        onClick={() => History.push(appRoutePath, undefined)}
        size="medium"
      />
    </Tooltip>
  );
};
