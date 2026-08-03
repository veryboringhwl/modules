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
registerRegistry("playbarWidget", registry);

let refresh: React.DispatchWithoutAction | undefined;

declare global {
  var __renderNowPlayingBarWidgets: any;
}

globalThis.__renderNowPlayingBarWidgets = () => [
  React.createElement(() => {
    [, refresh] = React.useReducer((n) => n + 1, 0);
    return <>{registry.all()}</>;
  })
];

transformer(
  (emit) => (str) => {
    str = str.replace(/("hitRemoveLike".+?})\)\]/, "$1),...__renderNowPlayingBarWidgets()]");

    emit();
    return str;
  },
  {
    glob: /^\/dwp-now-playing-bar\.js/
  }
);

export type PlaybarWidgetProps = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
};
export const PlaybarWidget = ({ label, icon, onClick }: PlaybarWidgetProps) => {
  return (
    <Tooltip label={label}>
      <UI.ButtonTertiary
        aria-label={label}
        condensed
        iconOnly={
          React.isValidElement(icon) ? (props) => React.cloneElement(icon, props) : undefined
        }
        onClick={onClick}
        size="small"
      />
    </Tooltip>
  );
};
