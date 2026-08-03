import { byCode, byProps, getModuleExport, resolveInto } from "../core/webpack.ts";

export let Color: Function & { Format: any };

const assignColor = () => {
  const main = getModuleExport<Function>(byCode("this.rgb"));
  const format = getModuleExport<any>(byProps("RGBA"));
  if (main && format) {
    Color = Object.assign(main, { Format: format });
  }
};

resolveInto(byCode("this.rgb"), assignColor);
resolveInto(byProps("RGBA"), assignColor);
