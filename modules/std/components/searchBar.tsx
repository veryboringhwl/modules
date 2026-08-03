import { FilterContext } from "../hooks/filterContext.ts";
import { React } from "../libs/react.ts";
import { FilterBox } from "./reactComponents.ts";

export const getProp = (obj: any, path: string) => {
  if (path.startsWith(".")) {
    return path
      .slice(1)
      .split(".")
      .reduce((acc, key) => acc?.[key], obj);
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
