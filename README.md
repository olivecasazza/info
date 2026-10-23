# info

The site at <https://info-ecl.pages.dev>: a Dioxus panel workspace over the
`info-core` content crate, with a Ratatui frontend (`info-tui`) and Bevy demos
(`flock`, `pipedream`) compiled to WebAssembly.

## How to get going

Everything runs inside the Nix dev shell.

```bash
nix develop
cd app/ui && trunk serve        # development server on http://127.0.0.1:8080
nix build .#info-ui             # hermetic site build
nix build .#pages               # GitHub Pages build
```

The development server must not inherit `NO_COLOR` (trunk reads it as a flag):
`nix develop --command bash -c 'unset NO_COLOR; exec trunk serve'`.

## Routing

Each project has a path (`/lib/bird-nix`, `/src/flock`,
`/projects/notebooks/kinematics`, …); loading one opens that project's panel,
and the address bar follows a click in the project list, so views can be
linked, reloaded and walked with back/forward. `/src/panel-kit` opens its
article; the web and terminal demos are one click away in the article's demo
section and in the project row.

## Checks

```bash
nix develop --command cargo test                     # workspace tests
nix run .#layout-probe -- --url http://127.0.0.1:4055  # layout at four sizes
```

The layout probe drives headless Chromium over CDP, at 420, 760, 1180 and
1600px wide, and reports a frame that does not span its container or collapsed
to nothing, a row that clips its text without an ellipsis, a broken image, and
a page wider than the viewport. It exits non-zero on any finding, so it can gate
a change to the workspace chrome or to anything embedded in a panel. On Linux it
uses nixpkgs' Chromium; on darwin it uses the installed Chrome or `$CHROME`.
