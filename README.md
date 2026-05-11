# Modules

Deno-based runtime modules for Spicetify v3 with JSX support.

## Development

Available tasks (see `deno.jsonc` for full list):

```sh
deno task cm:fetch      # Fetch latest classmap
deno task pw:build      # Build all modules
deno task pw:watch      # Build and watch for changes (hot-reload)
deno task pw:enable     # Enable built modules
deno task pw:disable    # Disable modules
```

## Modules

Each module lives under `modules/` with its own `metadata.json` and entry point (`load.ts`/`load.tsx`):

| Module                    | Description                          |
|---------------------------|--------------------------------------|
| `stdlib/`                 | Standard library (mixins, webpack, registers) |
| `adblock/`                | Block ads in Spotify                 |
| `marketplace/`            | Browse and install modules in-app    |
| `experimental-features/`  | Enable experimental Spotify features |
| `palette-manager/`        | Color palette/theming manager        |
| `test/`                   | Test module for development          |

Import paths use `/modules/` and `/hooks/` anchors resolved by the Deno import map.

## Release

```sh
deno task build:release
```

## License

GPLv3
