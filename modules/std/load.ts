import { hotwired, type LoadContext } from "/hooks/module.ts";

await hotwired<LoadContext>(import.meta);
