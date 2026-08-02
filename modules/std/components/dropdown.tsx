import { React } from "../libs/react.ts";
import { UI } from "./componentLibrary.ts";
import { createIconComponent } from "./createIconComponent.tsx";
import { ContextMenu, Menu, MenuItem } from "./reactComponents.ts";

const CheckIcon = () =>
  createIconComponent({
    icon: ""
  });

interface MenuItemProps<O extends string> {
  option: O;
  isActive: boolean;
  onSwitch: (option: O) => void;
  children: React.ReactNode;
}
const DropdownMenuItem = <O extends string>({
  option,
  isActive,
  onSwitch,
  children
}: MenuItemProps<O>) => {
  const activeStyle = {
    backgroundColor: "rgba(var(--spice-rgb-selected-row),.1)"
  };

  return (
    <MenuItem
      data-checked={isActive}
      onClick={() => onSwitch(option)}
      style={isActive ? activeStyle : undefined}
      trailingIcon={isActive ? <CheckIcon /> : undefined}
      trigger="click"
    >
      {children}
    </MenuItem>
  );
};

export interface OptionProps {
  preview?: boolean;
}
export type DropdownOptions = Record<string, React.FC<OptionProps>>;

interface DropdownMenuProps<O extends DropdownOptions> {
  options: O;
  activeOption: Extract<keyof NoInfer<O>, string>;
  onSwitch: (option: Extract<keyof NoInfer<O>, string>) => void;
}
function Dropdown<O extends DropdownOptions>({
  options,
  activeOption,
  onSwitch
}: DropdownMenuProps<O>) {
  const SelectedOption: React.FC<OptionProps> = options[activeOption];

  if (Object.keys(options).length === 1) {
    return (
      <button
        aria-expanded="false"
        className={MAP.sort_box.list.button}
        role="combobox"
        type="button"
      >
        <UI.Type semanticColor="textSubdued" variant="mesto">
          <SelectedOption preview />
        </UI.Type>
      </button>
    );
  }

  const DropdownMenu = (props: any) => {
    return (
      <Menu {...props}>
        {Object.entries(options).map(([option, Children]) => (
          <DropdownMenuItem
            key={option}
            isActive={option === activeOption}
            onSwitch={onSwitch}
            option={option as Extract<NoInfer<keyof O>, string>}
          >
            <Children />
          </DropdownMenuItem>
        ))}
      </Menu>
    );
  };

  return (
    <ContextMenu menu={<DropdownMenu />} trigger="click">
      <button
        aria-expanded="false"
        className={MAP.sort_box.list.button}
        role="combobox"
        type="button"
      >
        <UI.Type semanticColor="textSubdued" variant="mesto">
          <SelectedOption preview />
        </UI.Type>
        {createIconComponent({ icon: `<path d="m14 6-6 6-6-6h12z" />` })}
      </button>
    </ContextMenu>
  );
}
export default Dropdown;

export const useDropdown = <O extends DropdownOptions>({
  options,
  storage,
  storageVariable
}: {
  options: O;
  storage?: Storage;
  storageVariable?: string;
}) => {
  const [initialStorageVariable] = React.useState(storageVariable);
  const getDefaultOption = () => Object.keys(options).at(0) as Extract<keyof O, string>;
  const [activeOption, setActiveOption] = React.useState(getDefaultOption);

  React.useEffect(() => {
    if (storage && initialStorageVariable) {
      const stored = storage.getItem(`drop-down:${initialStorageVariable}`);
      if (stored !== null) {
        try {
          const parsed = JSON.parse(stored);
          if (options[parsed as Extract<keyof O, string>]) {
            setActiveOption(parsed as Extract<keyof O, string>);
          }
        } catch {}
      }
    }
  }, [storage, initialStorageVariable, options]);

  const setPersistedActiveOption = React.useCallback(
    (reducer: (state: Extract<keyof O, string>) => Extract<keyof O, string>) => {
      setActiveOption((prev) => {
        const next = reducer(prev);
        if (storage && initialStorageVariable) {
          storage.setItem(`drop-down:${initialStorageVariable}`, JSON.stringify(next));
        }
        return next;
      });
    },
    [storage, initialStorageVariable]
  );

  const dropdown = (
    <Dropdown
      activeOption={activeOption}
      onSwitch={(o) => setPersistedActiveOption(() => o)}
      options={options}
    />
  );

  return [dropdown, activeOption, setPersistedActiveOption] as const;
};
