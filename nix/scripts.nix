# Shell scripts and utilities
{ pkgs, wasmPkgs }:

let
  # Sync WASM from Nix store (symlinks for speed, no copies needed)
  sync-wasm = pkgs.writeShellApplication {
    name = "sync-wasm";
    runtimeInputs = [ pkgs.coreutils pkgs.git ];
    meta.description = "Sync WASM packages from Nix store via symlinks";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT"

      for pkg in flock pipedream spot; do
        echo "Syncing wasm/$pkg/pkg..."
        rm -rf "wasm/$pkg/pkg"

        # Get source path from Nix store
        case $pkg in
          flock)     SRC="${wasmPkgs.flock}" ;;
          pipedream) SRC="${wasmPkgs.pipedream}" ;;
          spot)      SRC="${wasmPkgs.spot}" ;;
        esac

        # Create directory and symlink individual files (not the whole dir, to allow .gitignore)
        mkdir -p "wasm/$pkg/pkg"
        for f in "$SRC"/*; do
          fname=$(basename "$f")
          # Skip tar files and symlinks in source
          if [ ! -L "$f" ] && [[ ! "$fname" =~ \.tar\.zst ]]; then
            ln -sf "$f" "wasm/$pkg/pkg/$fname"
          fi
        done

        echo "  -> $(find wasm/$pkg/pkg/ -maxdepth 1 -type l | wc -l) files"
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
      if [ ! -d wasm/flock/pkg ] || [ ! -d wasm/pipedream/pkg ] || [ ! -d wasm/spot/pkg ]; then
        echo "📦 Syncing WASM from Nix store (crane-cached)..."
        ${sync-wasm}/bin/sync-wasm
      fi

      # Clean stale modules
      rm -rf node_modules/flock node_modules/pipedream node_modules/spot 2>/dev/null || true
      chmod -R u+rwX node_modules 2>/dev/null || true

      echo ""
      echo "🚀 Starting dev server (Vue HMR + WASM auto-rebuild)"
      echo "   Initial: crane-cached from Nix store"
      echo "   Updates: wasm-pack incremental on file change"
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
          for pkg in flock pipedream spot; do
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
  generate-assets = pkgs.writeShellApplication {
    name = "generate-assets";
    runtimeInputs = [ pkgs.cargo pkgs.rustc ];
    meta.description = "Generate procedural assets (textures, terrain) using Rust";
    text = ''
      ROOT="$(git rev-parse --show-toplevel)"
      cd "$ROOT/wasm/spot/tools/asset-gen"
      echo "🔨 Compiling and running asset generator..."
      cargo run --release
    '';
  };

in {
  inherit sync-wasm build-pages dev generate-assets;
}
