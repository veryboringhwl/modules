import { React } from "../libs/react.ts";
import { UI } from "./componentLibrary.ts";
import { Link } from "./reactComponents.ts";

interface LinkChipProps {
  to: string;
  title: string;
  selected: boolean;
  onClick?: () => void;
}

const LinkChip: React.FC<LinkChipProps> = (props) => (
  <Link
    className={MAP.search_chips.chip}
    onClick={props.onClick}
    replace
    tabIndex={-1}
    to={props.to}
  >
    <UI.Chip selected={props.selected} selectedColorSet="invertedLight" tabIndex={-1}>
      {props.title}
    </UI.Chip>
  </Link>
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
          <LinkChip
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
