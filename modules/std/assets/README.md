# std

The standard library for Spicetify v3 — one module, four internal layers.

## Structure

| Folder        | Contents                                                                                                                                                               | Imports               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `core/`       | Framework glue: webpack require trap, bundle analysis, registry/registrar, mixin transformer handoff, cosmos interception, `future`                                    | nothing               |
| `libs/`       | npm packages surfaced from Spotify's bundle: React, classNames, Mousetrap, react-flip-toolkit, notistack, ReduxStore, lodash, rxjs                                     | `core`                |
| `api/`        | Spotify platform APIs: Platform, URI, Color/Locale, GraphQL defs, event bus, settings, storage, logger, DOM                                                            | `core`, `libs`        |
| `components/` | Spotify UI: ComponentLibrary, ReactComponents, ReactHooks/Query/Router, settings page sections, registers (menu, navlinks, playbar buttons, ...), modal and UI helpers | `core`, `libs`, `api` |

Dependency direction is strictly one-way — `core ← libs ← api ← components`. Each layer
exposes a single public barrel (`mod.ts`); consumer modules should only import from
barrels, never from `src`-style paths.

## Bundles

The finder modules (`*.xpui.ts`) wait for the xpui chunks and locate Spotify's
modules by fingerprint. Each finder group has a lazy barrel (`react.ts`,
`reactComponents.ts`, ...) whose bindings populate asynchronously — never read
them at module-evaluation time.

## Development

```
deno task fmt modules/std      # oxfmt
deno task lint modules/std     # oxlint
deno check modules/std/index.ts
```
