import { findBy } from "/hooks/util.ts";

import { exported, exportedFunctions, ready } from "../core/webpack.ts";

await ready;

export const Locale: any = exported.find((m) => m.getTranslations);

export const createUrlLocale: Function = findBy("has", "baseName", "language")(exportedFunctions);
