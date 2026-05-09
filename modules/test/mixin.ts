import type { Transformer } from "/hooks/transform.ts";

export default async function (transformer: Transformer) {
  transformer(
    (emit) => (str) => {
      emit();

      return str;
    },
    {
      glob: /^\/xpui-modules\.js$/,
    },
  );
}
