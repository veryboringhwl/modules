import type * as snackbar from "./snackbar.xpui.ts";

export let useSnackbar: typeof snackbar.useSnackbar;
export let useCustomSnackbar: typeof snackbar.useCustomSnackbar;

import("./snackbar.xpui.ts").then((m) => {
  useSnackbar = m.useSnackbar;
  useCustomSnackbar = m.useCustomSnackbar;
});
