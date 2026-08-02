import { React } from "../libs/react.ts";
import { UI } from "./componentLibrary.ts";
import { ScrollableContainer } from "./reactComponents.ts";

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

export interface ChipFilterProps {
  availableFilters: RFilterOpt[];
  selectedFilters: RFilterOpt[];
  toggleFilter: (filter: RFilterOpt) => void;
  className?: string;
}
export const ChipFilter = React.memo(
  ({ availableFilters, selectedFilters, toggleFilter, className }: ChipFilterProps) => {
    const createChip = (isSelected: boolean) => (filter: RFilterOpt, index: number) => (
      <UI.Chip
        index={index}
        key={filter.key}
        onClick={() => toggleFilter(filter)}
        secondary={isSelected && index > 0}
        selected={isSelected}
        selectedColorSet="invertedLight"
        style={{ marginBlockEnd: 0, willChange: "transform, opacity" }}
        tabIndex={-1}
      >
        {filter.filter[TreeNodeVal]}
      </UI.Chip>
    );

    return (
      selectedFilters.length + availableFilters.length > 0 && (
        <ScrollableContainer ariaLabel={"Filter options"} className={className}>
          {selectedFilters.map(createChip(true))}
          {availableFilters.map(createChip(false))}
        </ScrollableContainer>
      )
    );
  }
);

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
