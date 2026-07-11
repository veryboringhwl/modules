# Modules

Deno-based runtime modules for Spicetify v3 with JSX support.

## Development

Available tasks (see `deno.jsonc` for full list):

```sh
deno task fetch      # Fetch latest classmap
deno task build      # Build all modules
deno task watch      # Build and watch for changes (hot-reload)
deno task enable     # Enable built modules
deno task disable    # Disable modules
```

## Modules

Each module lives under `modules/` with its own `metadata.json` and entry point
(`load.ts`/`load.tsx`):
