import { UI } from "../components/componentLibrary.ts";
import { Tooltip } from "../components/reactComponents.ts";
import { Registry, registerRegistry } from "../core/registry.ts";
import { transformer } from "../core/transformer.ts";
import { React } from "../libs/react.ts";

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
registerRegistry("topbarRightButton", registry);

let refresh: React.DispatchWithoutAction | undefined;

declare global {
  var __renderTopbarRightButtons: () => React.ReactNode;
}

globalThis.__renderTopbarRightButtons = () =>
  React.createElement(() => {
    [, refresh] = React.useReducer((n) => n + 1, 0);

    return <>{registry.all().toReversed()}</>;
  });

transformer(
  (emit) => (str) => {
    emit();

    str = str.replace(
      /("login-button"[\s\S]*?![\w$]+\s*&&\s*\(0,[\w$]+\.jsxs\)\("div",\s*\{\s*className:\s*[\w$]+\(\)\([^)]+\),\s*children:\s*\[)/,
      "$1__renderTopbarRightButtons(),"
    );

    return str;
  },
  {
    glob: /^\/xpui-snapshot\.js/
  }
);

type TopbarRightButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
};

export const TopbarRightButton: React.FC<TopbarRightButtonProps> = ({
  label,
  disabled,
  icon,
  onClick
}: TopbarRightButtonProps) => {
  return (
    <Tooltip label={label}>
      <UI.ButtonTertiary
        aria-label={label}
        className={MAP.main.navbar.right.button.wrapper}
        condensedAll
        disabled={disabled}
        onClick={onClick}
        size="small"
      >
        {/*//@ts-expect-error*/}
        {icon && React.isValidElement(icon) ? React.cloneElement(icon, { size: "small" }) : icon}
      </UI.ButtonTertiary>
    </Tooltip>
  );
};
