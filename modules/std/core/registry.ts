export class Registry<E> extends Set<E> {
  public all(): Array<E> {
    return Array.from(this);
  }
}

export const registries = new Map<string, Registry<any>>();

export function registerRegistry(name: string, registry: Registry<any>): void {
  registries.set(name, registry);
}
