import { Registry, registerRegistry } from "../../core/registry.ts";
import { transformer } from "../../core/transformer.ts";
import { React } from "../../libs/react.ts";
import { UI } from "../componentLibrary.ts";
import { Tooltip } from "../reactComponents.ts";

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
registerRegistry("topbarLeftButton", registry);

let refresh: React.DispatchWithoutAction | undefined;

declare global {
  var __renderTopbarLeftButtons: any;
}

globalThis.__renderTopbarLeftButtons = () =>
  React.createElement(() => {
    [, refresh] = React.useReducer((n) => n + 1, 0);
    return <>{registry.all()}</>;
  });

transformer(
  (emit) => (str) => {
    str = str.replace(/("top-bar-forward-button"[^\]]*)/g, "$1,__renderTopbarLeftButtons()");
    emit();

    return str;
  },
  {
    glob: /^\/xpui-snapshot\.js/
  }
);

type TopbarLeftButtonProps = {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  "data-testid"?: string;
};

export const TopbarLeftButton = ({
  label,
  disabled,
  onClick,
  icon,
  "data-testid": dataTestId
}: TopbarLeftButtonProps) => {
  return (
    <Tooltip label={label}>
      <UI.ButtonTertiary
        aria-label={label}
        condensed
        data-testid={dataTestId}
        disabled={disabled}
        iconOnly={
          React.isValidElement(icon) ? (props) => React.cloneElement(icon, props) : undefined
        }
        onClick={onClick}
        size="medium"
      ></UI.ButtonTertiary>
    </Tooltip>
  );
};
