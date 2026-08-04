import { byCode, byProps, getModuleExport, resolveInto } from "../core/webpack.ts";

export type Color = Function & {
  Format: any;
  CSSFormat: any;
  fromHex(value: string): Color;
  parse(value: string): Color;
  toCSS(format?: any): string;
};

export let Color: Color;

const assignColor = () => {
  const main = getModuleExport<Color>(byCode("this.rgb"));
  const format = getModuleExport<any>(byProps("RGBA"));
  if (main && format) {
    Color = Object.assign(main, { Format: format, CSSFormat: format }) as Color;
  }
};

resolveInto(byCode("this.rgb"), assignColor);
resolveInto(byProps("RGBA"), assignColor);
