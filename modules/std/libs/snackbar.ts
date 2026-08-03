import { findModuleComponent } from "../core/lazyComponent.ts";
import { byCode, resolveInto } from "../core/webpack.ts";

import type React from "npm:@types/react";
import type {
  EnqueueSnackbar as EnqueueSnackbarT,
  OptionsObject as OptionsObjectT,
  useSnackbar as useSnackbarT
} from "npm:notistack";

type FN_useCustomSnackbar_OPTS =
  | (Omit<OptionsObjectT, "key"> & { keyPrefix: string })
  | (OptionsObjectT & { identifier: string });
type CustomSnackbar = (
  element: React.ReactElement,
  opts: FN_useCustomSnackbar_OPTS
) => ReturnType<EnqueueSnackbarT>;

export const Notistack = {
  useSnackbar: undefined as unknown as typeof useSnackbarT,
  useCustomSnackbar: undefined as unknown as CustomSnackbar,
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
};

resolveInto<typeof useSnackbarT>(
  byCode(/^function\(\)\{return\(0,[a-zA-Z_$][\w$]*\.useContext\)\([a-zA-Z_$][\w$]*\)\}$/),
  (value) => {
    Notistack.useSnackbar = value;
  }
);

resolveInto<CustomSnackbar>(
  byCode({ matches: ["enqueueCustomSnackbar", "headless"], mode: "all" }),
  (value) => {
    Notistack.useCustomSnackbar = value;
  }
);
