import { byProps, resolveInto } from "../core/webpack.ts";

import type MousetrapT from "npm:@types/mousetrap";

export let Mousetrap: typeof MousetrapT;

resolveInto<typeof MousetrapT>(byProps("addKeycodes"), (value) => {
  Mousetrap = value;
});
