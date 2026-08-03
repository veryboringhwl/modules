import { React } from "../libs/react.ts";
import {
  matchModule,
  resolveIntoSource,
  type ExportFilter,
  type ModuleMatcher
} from "./webpack.ts";

type LazySource<T> = { id: keyof any; component: React.FC<T> };

export type LazyComponent<T> = React.FC<T> & {
  hasResolved: boolean;
  resolved: React.FC<T> | undefined;
  moduleId: keyof any | undefined;
};

function lazyComponent<T>(getSource: () => LazySource<T> | undefined): LazyComponent<T> {
  const Lazy = (props: T) => {
    const Component = getSource()?.component;
    return Component ? React.createElement(Component as React.FC<any>, props as any) : null;
  };

  Object.defineProperty(Lazy, "hasResolved", {
    get: () => typeof getSource()?.component !== "undefined"
  });

  Object.defineProperty(Lazy, "resolved", {
    get: () => getSource()?.component
  });

  Object.defineProperty(Lazy, "moduleId", {
    get: () => getSource()?.id
  });

  return Lazy as LazyComponent<T>;
}

export function findModuleComponent<T extends object = any>(
  filter: ExportFilter
): LazyComponent<T> {
  let source: LazySource<T> | undefined;

  resolveIntoSource<React.FC<T>>(filter, (id, component) => {
    source = { id, component };
  });

  return lazyComponent(() => source);
}

export function findModuleComponentByFactory<T extends object = any>(
  matcher: ModuleMatcher,
  select: (exports: any) => unknown
): LazyComponent<T> {
  let source: LazySource<T> | undefined;

  matchModule(matcher).then(([id, exports]) => {
    const component = select(exports);
    if (component) {
      source = { id, component: component as React.FC<T> };
    }
  });

  return lazyComponent(() => source);
}
