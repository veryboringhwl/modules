import { React } from "../libs/react.ts";
import { UI } from "./componentLibrary.ts";
import { NavTo } from "./reactComponents.ts";

interface NavToChipProps {
  to: string;
  title: string;
  selected: boolean;
  onClick?: () => void;
}

const NavToChip: React.FC<NavToChipProps> = (props) => (
  <NavTo
    className={MAP.search_chips.chip}
    onClick={props.onClick}
    replace
    tabIndex={-1}
    to={props.to}
  >
    <UI.Chip selected={props.selected} selectedColorSet="invertedLight" tabIndex={-1}>
      {props.title}
    </UI.Chip>
  </NavTo>
);

export interface NavBarProps {
  namespace: string;
  categories: string[];
  selectedCategory: string;
}

const NavBar = ({ namespace, categories, selectedCategory }: NavBarProps) => (
  <div className={MAP.search_chips.wrapper_wrapper}>
    <div className={`${MAP.search_chips.wrapper} contentSpacing`}>
      <div className={MAP.search_chips.container}>
        {categories.map((category) => (
          <NavToChip
            key={category}
            selected={category === selectedCategory}
            title={category}
            to={`spotify:app:bespoke:${namespace}:${category}`}
          />
        ))}
      </div>
    </div>
  </div>
);

export const TopNavBar = (props: NavBarProps) => (
  <div className="qHWqOt_TYlFxiF0Dm2fD" style={{ pointerEvents: "all" }}>
    <NavBar {...props} />
  </div>
);
