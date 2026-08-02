import type { Transformer } from "/hooks/transform.ts";

export let transformer: Transformer;

export const setTransformer = (value: Transformer): void => {
  transformer = value;
};
