# Development shell configuration
{ pkgs, rust }:

pkgs.mkShell {
  packages = [
    # Node / Nuxt
    pkgs.nodejs_20

    # Rust/WASM
    rust
    pkgs.wasm-pack
    pkgs.wasm-bindgen-cli
    pkgs.binaryen # wasm-opt
    pkgs.wabt # wasm2wat/wat2wasm
    pkgs.nodePackages.wrangler # For Cloudflare Pages local dev/deploy

    # Common native build helpers (some npm deps may use node-gyp)
    pkgs.python3
    pkgs.pkg-config
    pkgs.openssl

    # Watcher
    pkgs.watchexec

    # Editor tooling
    pkgs.rust-analyzer
    pkgs.claude-code

    # Shell caching (lorri-equivalent for flakes)
    pkgs.nix-direnv
    pkgs.direnv
  ];

  shellHook = ''
    export RUST_BACKTRACE=1
    export CARGO_INCREMENTAL=1  # Faster Rust rebuilds

    # Keep npm cache local to the repo to avoid permission issues with ~/.npm
    export npm_config_cache="$PWD/.npm-cache"

    echo ""
    echo "🦀 Dev shell ready"
    echo "   node:      $(node -v)"
    echo "   rustc:     $(rustc -V | cut -d' ' -f2)"
    echo "   wasm-pack: $(wasm-pack --version)"
    echo ""
    echo "Commands:"
    echo "   nix run .#dev       - Start dev server with HMR + WASM auto-rebuild"
    echo "   nix run .#sync-wasm - Sync WASM from Nix store"
    echo ""
  '';
}
