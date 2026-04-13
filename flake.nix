{
  description = "Nuxt 3 + Tailwind + Rust/WASM dev environment (Cloudflare Pages build)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
    crane.url = "github:ipetkov/crane";
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay, crane }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ (import rust-overlay) ];
        config.allowUnfree = true;
      };

      rustToolchainFor = p:
        p.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rustfmt" "clippy" ];
          targets = [ "wasm32-unknown-unknown" ];
        };

      rust = rustToolchainFor pkgs;
      craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchainFor;

      # Import modules
      wasmPkgs = import ./nix/wasm.nix { inherit pkgs craneLib; };
      scripts = import ./nix/scripts.nix { inherit pkgs wasmPkgs; };
      devShell = import ./nix/devshell.nix { inherit pkgs rust; };

    in {
      devShells.default = devShell;

      packages = {
        flock-wasm-pkg = wasmPkgs.flock;
        pipedream-wasm-pkg = wasmPkgs.pipedream;
        spot-wasm-pkg = wasmPkgs.spot;
        inherit (scripts) sync-wasm build-pages dev generate-assets;
        default = scripts.build-pages;
      };

      apps = {
        sync-wasm = flake-utils.lib.mkApp { drv = scripts.sync-wasm; } // { meta = scripts.sync-wasm.meta or {}; };
        build-pages = flake-utils.lib.mkApp { drv = scripts.build-pages; } // { meta = scripts.build-pages.meta or {}; };
        dev = flake-utils.lib.mkApp { drv = scripts.dev; } // { meta = scripts.dev.meta or {}; };
        generate-assets = flake-utils.lib.mkApp { drv = scripts.generate-assets; } // { meta = scripts.generate-assets.meta or {}; };
        default = flake-utils.lib.mkApp { drv = scripts.build-pages; } // { meta = scripts.build-pages.meta or {}; };
      };
    });
}
