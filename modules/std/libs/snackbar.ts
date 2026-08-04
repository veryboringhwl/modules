import { createApi, resolve } from "../core/expose.ts";
import { findModuleComponent } from "../core/lazyComponent.ts";
import { byCode } from "../core/webpack.ts";

import type { LazyComponent } from "../core/lazyComponent.ts";
import type React from "npm:@types/react";
import type {
  EnqueueSnackbar as EnqueueSnackbarT,
  OptionsObject as OptionsObjectT,
  SnackbarProviderProps,
  useSnackbar as useSnackbarT
} from "npm:notistack";

type FN_useCustomSnackbar_OPTS =
  | (Omit<OptionsObjectT, "key"> & { keyPrefix: string })
  | (OptionsObjectT & { identifier: string });
type CustomSnackbar = (
  element: React.ReactElement,
  opts: FN_useCustomSnackbar_OPTS
) => ReturnType<EnqueueSnackbarT>;

export type NotistackApi = {
  useSnackbar: typeof useSnackbarT;
  useCustomSnackbar: CustomSnackbar;
  SnackbarProvider: React.FC<SnackbarProviderProps>;
  Snackbar: {
    wrapper: LazyComponent<any>;
    simpleLayout: LazyComponent<any>;
    ctaText: LazyComponent<any>;
    styledImage: LazyComponent<any>;
  };
};

export const Notistack = createApi<NotistackApi>({
  useSnackbar: resolve(
    byCode(/^function\(\)\{return\(0,[a-zA-Z_$][\w$]*\.useContext\)\([a-zA-Z_$][\w$]*\)\}$/)
  ),
  useCustomSnackbar: resolve(
    byCode({ matches: ["enqueueCustomSnackbar", "headless"], mode: "all" })
  ),
  SnackbarProvider: findModuleComponent(byCode("enqueueSnackbar called with invalid argument")),
  Snackbar: {
    wrapper: findModuleComponent(
      byCode({ matches: ["encore-light-theme", "elevated"], mode: "all" })
    ),
    simpleLayout: findModuleComponent(
      byCode({ matches: ["leading", "center", "trailing"], mode: "all" })
    ),
    ctaText: findModuleComponent(byCode("ctaText")),
    styledImage: findModuleComponent(byCode("placeholderSrc"))
  }
});
