import { rxjs } from "./deps.ts";

const subject = new rxjs.Subject<void>();

export const signal = {
  push: () => subject.next(),
  pull: (fn: () => void) => subject.subscribe(fn)
};
