import { get } from "../../deps.ts";
import { React } from "../../src/expose/React.ts";
import { FilterContext } from "../../src/webpack/FilterContext.xpui.ts";
import { FilterBox } from "../../src/webpack/ReactComponents.xpui.ts";
import { ChipFilter } from "./ChipFilter.tsx";
import Dropdown, { type DropdownOptions } from "./Dropdown.tsx";

interface UseDropdownOpts<O extends DropdownOptions> {
  options: O;
  storage?: Storage;
  storageVariable?: string;
}

export const useDropdown = <O extends DropdownOptions>({
  options,
  storage,
  storageVariable
}: UseDropdownOpts<O>) => {
  const [initialStorageVariable] = React.useState(storageVariable);
  const getDefaultOption = () => Object.keys(options)[0] as Extract<keyof O, string>;
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

export const TreeNodeVal = Symbol.for("TreeNodeVal");
export type Tree<E> = {
  [TreeNodeVal]?: E;
  [key: string]: Tree<E>;
};

export type RTree<E> = {
  [TreeNodeVal]: E;
  [key: string]: Tree<E>;
};

export type FilterOpt = { key: string; filter: Tree<React.ReactNode> };
export type RFilterOpt = { key: string; filter: Required<Tree<React.ReactNode>> };

export const useChipFilter = (filters: Tree<React.ReactNode>) => {
  const [selectedFilterFullKey, setSelectedFilterFullKey] = React.useState("");

  const selectedFilters = React.useMemo(
    () =>
      selectedFilterFullKey
        .split(".")
        .slice(1)
        .reduce(
          (selectedFilters, selectedFilterFullKeyPart) => {
            const prevSelectedFilter = selectedFilters.at(-1)!;
            const selectedFilter = {
              key: `${prevSelectedFilter.key}.${selectedFilterFullKeyPart}`,
              filter: prevSelectedFilter.filter[selectedFilterFullKeyPart]
            };
            selectedFilters.push(selectedFilter);
            return selectedFilters;
          },
          [{ key: "", filter: filters }]
        ),
    [filters, selectedFilterFullKey]
  );

  const lastSelectedFilter = selectedFilters.at(-1)!;
  const availableFilters: FilterOpt[] = [];
  for (const [k, v] of Object.entries(lastSelectedFilter.filter)) {
    availableFilters.push({ key: `${lastSelectedFilter.key}.${k}`, filter: v });
  }

  const toggleFilter = React.useCallback(
    (filter: RFilterOpt) => {
      if (filter.key === selectedFilterFullKey) {
        const parts = selectedFilterFullKey.split(".");
        parts.pop();
        setSelectedFilterFullKey(parts.join("."));
      } else {
        setSelectedFilterFullKey(filter.key);
      }
    },
    [selectedFilterFullKey]
  );
  const treeNodeHasVal = (n: FilterOpt): n is RFilterOpt => !!n.filter[TreeNodeVal];

  const chipFilter = (
    <ChipFilter
      availableFilters={availableFilters.filter(treeNodeHasVal)}
      selectedFilters={selectedFilters.filter(treeNodeHasVal)}
      toggleFilter={toggleFilter}
    />
  );

  return [chipFilter, selectedFilters, selectedFilterFullKey, setSelectedFilterFullKey] as const;
};
