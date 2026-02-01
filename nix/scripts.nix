# Shell scripts and utilities
{ pkgs, wasmPkgs }:

let
  # Sync WASM from Nix store (for CI/production - reproducible, optimized)
  sync-wasm = pkgs.writeShellApplication {
    name = "sync-wasm";
    runtimeInputs = [ pkgs.coreutils pkgs.git ];
    meta.description = "Sync optimized WASM packages from Nix store";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT"

      for pkg in flock pipedream spot; do
        echo "Syncing wasm/$pkg/pkg..."
        rm -rf "wasm/$pkg/pkg"
        mkdir -p "wasm/$pkg/pkg"

        # Get source path
        case $pkg in
          flock)     SRC="${wasmPkgs.flock}" ;;
          pipedream) SRC="${wasmPkgs.pipedream}" ;;
          spot)      SRC="${wasmPkgs.spot}" ;;
        esac

        # Copy only regular files (skip symlinks and tar archives)
        for f in "$SRC"/*; do
          fname=$(basename "$f")
          # Skip symlinks and tar files
          if [ ! -L "$f" ] && [[ ! "$fname" =~ \.tar\.zst ]]; then
            cp "$f" "wasm/$pkg/pkg/"
          fi
        done

        chmod -R u+rwX "wasm/$pkg/pkg"
        echo "  -> $(find wasm/$pkg/pkg/ -maxdepth 1 -type f | wc -l) files"
      done
      echo "Done."
    '';
  };

  build-pages = pkgs.writeShellApplication {
    name = "build-pages";
    runtimeInputs = [ pkgs.nodejs_20 ];
    meta.description = "Build static site for Cloudflare Pages";
    text = ''
      export npm_config_cache="$PWD/.npm-cache"
      # Sync WASM first (nuxt prepare in postinstall needs it)
      ${sync-wasm}/bin/sync-wasm
      npm ci
      npx nuxt generate
      touch .output/public/.nojekyll
      echo "Built static site at .output/public"
    '';
  };

  # Unified dev command: Vue HMR + WASM auto-rebuild
  dev = pkgs.writeShellApplication {
    name = "dev";
    runtimeInputs = [ pkgs.nodejs_20 pkgs.watchexec pkgs.wasm-pack pkgs.wasm-bindgen-cli pkgs.binaryen pkgs.coreutils pkgs.git ];
    meta.description = "Dev server with auto-rebuild for Vue and WASM";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT"
      export npm_config_cache="$PWD/.npm-cache"

      # Install npm deps if needed
      [ -x node_modules/.bin/nuxt ] || npm install

      # Build WASM if missing
      build_wasm() {
        for pkg in flock pipedream spot; do
          echo "Building $pkg..."
          (cd "wasm/$pkg" && wasm-pack build . --target web --dev) || echo "$pkg failed"
        done
      }

      [ -d wasm/flock/pkg ] && [ -d wasm/pipedream/pkg ] && [ -d wasm/spot/pkg ] || build_wasm

      # Clean stale modules
      rm -rf node_modules/flock node_modules/pipedream node_modules/spot 2>/dev/null || true
      chmod -R u+rwX node_modules 2>/dev/null || true

      echo ""
      echo "Starting dev server (Vue HMR + WASM auto-rebuild)..."
      echo ""

      # Cleanup on exit
      trap 'kill $(jobs -p) 2>/dev/null' EXIT

      # WASM watcher in background
      watchexec -w wasm -e rs,toml --ignore 'wasm/*/pkg/**' --ignore 'wasm/target/**' \
        --debounce 500ms -- sh -c 'for p in flock pipedream spot; do (cd wasm/$p && wasm-pack build . --target web --dev); done' &

      # Vue dev server
      npm run dev -- "$@"
    '';
  };

in {
  inherit sync-wasm build-pages dev;
}
