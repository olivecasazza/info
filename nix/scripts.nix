# Shell scripts and utilities
{ pkgs, wasmPkgs }:

let
  sync-wasm = pkgs.writeShellApplication {
    name = "sync-wasm";
    runtimeInputs = [ pkgs.coreutils pkgs.git ];
    meta = {
      description = "Sync WASM packages from Nix store to local directories";
      mainProgram = "sync-wasm";
    };
    text = ''
      set -euo pipefail

      # Find and cd to repo root
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT"

      echo "Syncing wasm/flock/pkg from Nix store..."
      rm -rf wasm/flock/pkg
      mkdir -p wasm/flock/pkg
      cp -r ${wasmPkgs.flock}/* wasm/flock/pkg/
      chmod -R u+rwX wasm/flock/pkg

      echo "Syncing wasm/pipedream/pkg from Nix store..."
      rm -rf wasm/pipedream/pkg
      mkdir -p wasm/pipedream/pkg
      cp -r ${wasmPkgs.pipedream}/* wasm/pipedream/pkg/
      chmod -R u+rwX wasm/pipedream/pkg

      echo "Syncing wasm/spot/pkg from Nix store..."
      rm -rf wasm/spot/pkg
      mkdir -p wasm/spot/pkg
      cp -r ${wasmPkgs.spot}/* wasm/spot/pkg/
      chmod -R u+rwX wasm/spot/pkg

      echo "WASM packages synced."
    '';
  };

  build-pages = pkgs.writeShellApplication {
    name = "build-pages";
    runtimeInputs = [ pkgs.nodejs_20 ];
    meta = {
      description = "Build static site for Cloudflare Pages";
      mainProgram = "build-pages";
    };
    text = ''
      set -euo pipefail

      export npm_config_cache="$PWD/.npm-cache"

      npm ci

      # Ensure wasm packages exist (from reproducible Nix build)
      ${sync-wasm}/bin/sync-wasm

      # Generate the static site (Cloudflare Pages compatible)
      npx nuxt generate
      touch .output/public/.nojekyll

      echo "Built static site at .output/public"
    '';
  };

  dev = pkgs.writeShellApplication {
    name = "dev";
    runtimeInputs = [ pkgs.nodejs_20 ];
    meta = {
      description = "Run Nuxt development server";
      mainProgram = "dev";
    };
    text = ''
      set -euo pipefail

      export npm_config_cache="$PWD/.npm-cache"

      if [ ! -x node_modules/.bin/nuxt ]; then
        echo "node_modules missing; installing dependencies..."
        npm install
      fi

      if [ ! -d wasm/flock/pkg ] || [ ! -d wasm/pipedream/pkg ] || [ ! -d wasm/spot/pkg ]; then
        ${sync-wasm}/bin/sync-wasm
      fi

      # vite-plugin-wasm-pack copies into node_modules/flock; ensure no stale read-only dir.
      rm -rf node_modules/flock || true
      mkdir -p node_modules

      # Some prior syncs can leave read-only bits; ensure npm deps are writable too.
      chmod -R u+rwX node_modules || true

      npm run dev -- "$@"
    '';
  };

in {
  inherit sync-wasm build-pages dev;
}
