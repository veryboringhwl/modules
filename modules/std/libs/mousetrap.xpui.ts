import { exports, ready } from "../core/webpack.ts";

import type MousetrapT from "npm:@types/mousetrap";

await ready;

export const Mousetrap: typeof MousetrapT = exports.find((m) => m.addKeycodes);
