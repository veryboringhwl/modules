# std

The standard library for Spicetify v3 — one module, six internal layers.

## Structure

| Folder        | Contents                                                                                                                                                                                                                                | Imports                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `core/`       | Framework glue: webpack runtime bridge (`webpackRuntime`), subscription-based finder (`webpack`, `byCode`/`byProps`/`byComponentCode`/`byFactorySource`), lazy components, registry/registrar, transformer handoff, `signal`, rxjs deps | nothing                             |
| `libs/`       | npm packages surfaced from Spotify's bundle: `React`, `classnames`, `Mousetrap`, `ReactFlipToolkit`, `Notistack`, `Redux`, `ReactQuery`, `ReactRouter`, rxjs                                                                            | `core`                              |
| `hooks/`      | Spotify-internal React hooks and contexts: `reactHooks`, `filterContext`                                                                                                                                                                | `core`, `api`                       |
| `api/`        | Spotify platform APIs: `Platform`, `URI`, `Color`, `Locale`, `GraphQLDefs`, event bus, settings, storage, logger, DOM                                                                                                                   | `core`, `libs`                      |
| `components/` | Spotify UI: Encore (`UI`), Spotify internals (`reactComponents`), and std-authored components (modal, dropdown, chipFilter, searchBar, ...)                                                                                             | `core`, `libs`, `api`, `hooks`      |
| `registers/`  | Shell integration: registry + transformer pairs for menu, navlinks, playbar buttons, panels, routes, root, settings sections, topbar buttons                                                                                            | `core`, `libs`, `api`, `components` |

Dependency direction is strictly one-way — `core ← libs ← hooks ← api ← components/registers`. Each layer
exposes a single public barrel (`index.ts`); consumer modules should only import from
barrels, never from internal paths.

## Resolution

The finder (`core/webpack.ts`) resolves Spotify internals in three phases:

1. **Executed modules** — `moduleCache`, fed by `moduleExecutedSubject` (a ReplaySubject, so late importers self-heal)
2. **Defined but not executed** — factory source scan (filters carry a `source` predicate), executing only matched modules
3. **Not yet defined** — subscription, resolved when the chunk arrives

`byCode` matches functions by source, `byComponentCode` matches React components (memo/forwardRef, immune to plain-function false positives), `byProps` matches by property shape, `byFactorySource` matches modules by factory source. `findModuleComponent` returns a lazy wrapper with `hasResolved`, `resolved`, and `moduleId` for debugging.

## Development

```
deno task fmt
deno task lint
deno check modules/std
creator build --modules std --classmap classmap.json
```
