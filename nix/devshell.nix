# Development shell
{ pkgs, rust }:

pkgs.mkShell {
  packages = [
    # Rust/WASM
    rust
    pkgs.trunk
    pkgs.wasm-bindgen-cli
    pkgs.wasm-pack
    pkgs.binaryen

    # Native build helpers
    pkgs.pkg-config
    pkgs.openssl

    # Editor tooling
    pkgs.rust-analyzer
  ];

  shellHook = ''
    export RUST_BACKTRACE=1
    export CARGO_INCREMENTAL=1

    echo ""
    echo "Dev shell ready"
    echo "  rustc:        $(rustc -V | cut -d' ' -f2)"
    echo "  trunk:        $(trunk --version | cut -d' ' -f2)"
    echo "  wasm-bindgen: $(wasm-bindgen --version | cut -d' ' -f2)"
    echo ""
    echo "Commands:"
    echo "  cd app/ui && trunk serve    # Dioxus dev server"
    echo "  nix build .#info-ui         # Hermetic build"
    echo "  nix build .#pages           # GitHub Pages build"
    echo ""
  '';
}
