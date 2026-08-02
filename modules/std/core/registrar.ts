import { registries } from "./registry.ts";

import type { ModuleInstance } from "/hooks/module.ts";

type RegistryLike = {
  add(...args: any[]): unknown;
  delete(...args: any[]): boolean;
};

export class Registrar {
  private readonly ledger = new Map<any, string>();

  public register(type: string, ...args: any[]): void {
    const registry = registries.get(type) as RegistryLike | undefined;
    if (!registry) {
      throw new Error(`No registry is registered for type '${type}'. Is the 'std' mixin running?`);
    }
    this.ledger.set(args[0], type);
    registry.add(...args);
  }

  public unregister(type: string, ...args: any[]): void {
    const registry = registries.get(type) as RegistryLike | undefined;
    if (!registry) return;
    this.ledger.delete(args[0]);
    registry.delete(...args);
  }

  public dispose(): void {
    for (const [item, type] of this.ledger.entries()) {
      this.unregister(type, item);
    }
    this.ledger.clear();
  }
}

export const createRegistrar = (mod: ModuleInstance): Registrar => {
  const registrar = new Registrar();
  mod._jsIndex?.disposableStack.defer(() => {
    registrar.dispose();
  });
  return registrar;
};
