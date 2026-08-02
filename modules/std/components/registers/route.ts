import { Registry, registerRegistry } from "../../core/registry.ts";
import { transformer } from "../../core/transformer.ts";

import type { React } from "../../libs/react.ts";

const registry = new Registry<React.ReactNode>();
registerRegistry("route", registry);

declare global {
  var __renderRoutes: any;
}

globalThis.__renderRoutes = () => registry.all();
transformer(
  (emit) => (str) => {
    emit();

    str = str.replace(
      /(\(0,[a-zA-Z_$][\w$]*\.jsx\)\([a-zA-Z_$][\w$]*\.[a-zA-Z_$][\w$]*,\{[^{]*path:"\/search\/\*")/,
      "...__renderRoutes(),$1"
    );

    return str;
  },
  {
    glob: /^\/xpui-snapshot\.js/
  }
);

transformer(
  (emit) => (str) => {
    str = str.replace('["","/","/home/",', '["","/","/home/","/spicetify/*",');

    emit();
    return str;
  },
  {
    glob: /^\/dwp-top-bar\.js/
  }
);
