import { get } from "../libs/deps.ts";
import { React } from "../libs/react.ts";
import { FilterContext } from "./filterContext.ts";
import { FilterBox } from "./reactComponents.ts";

export const getProp = (obj: any, path: string) => {
  if (path.startsWith(".")) {
    return get(obj, path.slice(1));
  }
  return obj;
};

export const useSearchBar = ({
  placeholder,
  expanded
}: {
  placeholder: string;
  expanded: boolean;
}) => {
  const [search, setSearch] = React.useState("");
  const searchProps = { filter: "", setFilter: (f: string) => setSearch(f) };

  const searchbar = (
    <FilterContext.Provider value={searchProps}>
      <FilterBox alwaysExpanded={expanded} placeholder={placeholder} />
    </FilterContext.Provider>
  );

  return [searchbar, search] as const;
};
