# Shell scripts and utilities
{ pkgs, wasmPkgs }:

let
  # Sync WASM from Nix store. vite-plugin-wasm-pack copies wasm/<pkg>/pkg into
  # node_modules/<pkg> and trips on symlinks into the read-only nix store, so
  # materialize real writable files here.
  sync-wasm = pkgs.writeShellApplication {
    name = "sync-wasm";
    runtimeInputs = [ pkgs.coreutils pkgs.git ];
    meta.description = "Sync WASM packages from Nix store (writable copies)";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
     cd "$ROOT"
      for pkg in flock pipedream; do
       echo "Syncing wasm/$pkg/pkg..."
      rm -rf "wasm/$pkg/pkg"
      case "$pkg" in
        flock)     SRC="${wasmPkgs.flock}" ;;
        pipedream) SRC="${wasmPkgs.pipedream}" ;;
      esac
       mkdir -p "wasm/$pkg/pkg"
       for f in "$SRC"/*; do
          fname=$(basename "$f")
          # Skip tar files and symlinks in source
          if [ ! -L "$f" ] && [[ ! "$fname" =~ \.tar\.zst ]]; then
            cp -L "$f" "wasm/$pkg/pkg/$fname"
            chmod u+w "wasm/$pkg/pkg/$fname"
          fi
        done

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

  # Unified dev command: Vue HMR + WASM auto-rebuild (optimized)
  dev = pkgs.writeShellApplication {
    name = "dev";
    runtimeInputs = [ pkgs.nodejs_20 pkgs.watchexec pkgs.wasm-pack pkgs.wasm-bindgen-cli pkgs.binaryen pkgs.coreutils pkgs.git ];
    meta.description = "Dev server with auto-rebuild for Vue and WASM (optimized)";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT"
      export npm_config_cache="$PWD/.npm-cache"

      # Enable incremental Rust compilation for wasm-pack rebuilds
      export CARGO_INCREMENTAL=1

      # Install npm deps if needed
      [ -x node_modules/.bin/nuxt ] || npm install

      # Use crane-built WASM packages if available (fast, cached)
     # Only fall back to wasm-pack for incremental dev rebuilds
      if [ ! -d wasm/flock/pkg ] || [ ! -d wasm/pipedream/pkg ]; then
       echo "📦 Syncing WASM from Nix store (crane-cached)..."
        ${sync-wasm}/bin/sync-wasm
      fi

     # Clean stale modules
      rm -rf node_modules/flock node_modules/pipedream 2>/dev/null || true
     chmod -R u+rwX node_modules 2>/dev/null || true

      echo ""
     echo "🚀 Starting dev server (Vue HMR + WASM auto-rebuild)"
     echo "   Initial: crane-cached from Nix store"
     echo "   Updates: wasm-pack incremental on file change (flock/pipedream only)"
     echo ""

      # Cleanup on exit
      trap 'kill $(jobs -p) 2>/dev/null' EXIT

     # Smart WASM watcher - rebuild only changed package with wasm-pack (incremental)
     # shellcheck disable=SC2016
     watchexec -w wasm -e rs,toml \
       --ignore 'wasm/*/pkg/**' \
       --ignore 'wasm/target/**' \
       --ignore 'wasm/*/target/**' \
       --debounce 300ms \
        -- sh -c '
          for pkg in flock pipedream; do
            if find "wasm/$pkg/src" -name "*.rs" -newer "wasm/$pkg/pkg" 2>/dev/null | grep -q .; then
              echo "♻️  Rebuilding $pkg (incremental)..."
              (cd "wasm/$pkg" && wasm-pack build . --target web) 2>&1 | tail -2
            fi
          done
        ' &

      # Vue dev server
      npm run dev -- "$@"
    '';
  };

  # Generator for game assets (textures, terrain)
  # Source lives in skypilot-env/spot/wasm-gym/tools/asset-gen
  generate-assets = pkgs.writeShellApplication {
    name = "generate-assets";
    runtimeInputs = [ pkgs.cargo pkgs.rustc ];
    meta.description = "Generate procedural assets (textures, terrain) using Rust";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      SKYPILOT_REPO="$(dirname "$ROOT")/skypilot-env"
      ASSET_GEN_DIR="$SKYPILOT_REPO/spot/wasm-gym/tools/asset-gen"
      if [ ! -d "$ASSET_GEN_DIR" ]; then
        echo "Error: asset-gen not found at $ASSET_GEN_DIR"
        echo "Ensure skypilot-env is checked out as a sibling of the info repo."
        exit 1
      fi
      cd "$ASSET_GEN_DIR"
      echo "🔨 Compiling and running asset generator..."
      cargo run --release
    '';
  };

in {
  inherit sync-wasm build-pages dev generate-assets;
}
