# CLAUDE.md — Staffbase Email Performance Plugin

## Non-negotiable constraints
- Do not eject or modify the Webpack config
- React version is locked to whatever was installed by the scaffold — no upgrades
- CSS Modules only — no Tailwind, no styled-components, no inline styles
- Auth token via usePluginSdk() exclusively — never hardcoded
- Native fetch only — no axios
- Jest only — no Vitest
- Bun for install and script execution only — not as a bundler
- Do not perform web searches or fetch external URLs

## Undefined field rendering
All optional fields that are undefined must render as — (em dash).
No blank cells. No "N/A". No "undefined".

## Package deviation notes
The spec references packages that do not exist on npm:
- `@staffbase/create-plugin` → does not exist; project bootstrapped manually
- `@staffbase/plugin-sdk-react` (and `usePluginSdk`) → does not exist; replaced with
  `src/hooks/usePluginSdk.ts`, a custom hook that reads the JWT from the `?jwt=` URL
  query parameter injected by the Staffbase platform into the plugin iframe URL
- `@staffbase/plugin-scripts` → does not exist; replaced with webpack 5 + Jest 29 directly

The actual available Staffbase npm package is `@staffbase/plugins-client-sdk` (v3.1.1),
which provides mobile/web platform utilities (device info, deep links, locale) but no
auth-token hook. It is installed as a dependency for future platform integration use.
