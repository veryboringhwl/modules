export const waitForElement = <E extends Element>(
  selector: string,
  timeout = 5000,
  location = document.body
) =>
  new Promise<E>((resolve, reject) => {
    let settled = false;
    const timer = timeout
      ? setTimeout(() => {
          settled = true;
          observer.disconnect();
          reject(new Error(`waitForElement: timed out waiting for ${selector}`));
        }, timeout)
      : null;

    const onMutation = () => {
      if (settled) return;
      const el = location.querySelector<E>(selector);
      if (el) {
        settled = true;
        if (timer) clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    };

    const observer = new MutationObserver(onMutation);
    onMutation();
    observer.observe(location, {
      childList: true,
      subtree: true
    });
  });

export const mainElement = document.querySelector("main")!;
export const [REACT_FIBER, REACT_PROPS] = Object.keys(mainElement);
