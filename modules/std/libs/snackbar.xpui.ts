import { findBy } from "/hooks/util.ts";

import { exportedFunctions, ready } from "../core/webpack.ts";

import type React from "npm:@types/react";
import type {
  EnqueueSnackbar as EnqueueSnackbarT,
  OptionsObject as OptionsObjectT,
  useSnackbar as useSnackbarT
} from "npm:notistack";

await ready;

export const useSnackbar: typeof useSnackbarT = findBy(
  /^function\(\)\{return\(0,[a-zA-Z_$][\w$]*\.useContext\)\([a-zA-Z_$][\w$]*\)\}$/
)(exportedFunctions);

type FN_useCustomSnackbar_OPTS =
  | (Omit<OptionsObjectT, "key"> & { keyPrefix: string })
  | (OptionsObjectT & { identifier: string });
export const useCustomSnackbar: (
  element: React.ReactElement,
  opts: FN_useCustomSnackbar_OPTS
) => ReturnType<EnqueueSnackbarT> = findBy("enqueueCustomSnackbar", "headless")(exportedFunctions);
