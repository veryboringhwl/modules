export const future = {
  push: () => {},
  pull(fn: () => void) {
    const { push } = this;
    this.push = () => {
      push();
      fn();
    };
  }
};
