{
  description = "Nuxt 3 + Tailwind + Rust/WASM dev environment (Cloudflare Pages build)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    # Rust toolchains
    rust-overlay.url = "github:oxalica/rust-overlay";
    # Reproducible Rust builds
    crane.url = "github:ipetkov/crane";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    rust-overlay,
    crane,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ (import rust-overlay) ];
      };

      rustToolchainFor = p:
        p.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rustfmt" "clippy" ];
          targets = [ "wasm32-unknown-unknown" ];
        };

      rust = rustToolchainFor pkgs;

      craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchainFor;

      # -----------------------------
      # Rust/WASM (reproducible build)
      # -----------------------------
      mkWasmPkg = { name, path, themeColors ? false }: let
        # craneLib.cleanCargoSource uses a conservative filter that excludes non-standard files.
        src = pkgs.lib.cleanSourceWith {
          src = path;
          filter = path: type:
            (craneLib.filterCargoSources path type)
            || (themeColors && (builtins.match ".*/themeColors\\.json$" (toString path) != null));
        };

        commonArgs = {
          inherit src;
          strictDeps = true;

          # Always respect Cargo.lock and build for wasm.
          cargoExtraArgs = "--locked --target wasm32-unknown-unknown";

          nativeBuildInputs = [
            pkgs.wasm-pack
            pkgs.wasm-bindgen-cli
            pkgs.binaryen
            pkgs.pkg-config
          ];
        };

        cargoArtifacts = craneLib.buildDepsOnly (commonArgs // {
          pname = "${name}-wasm-deps";
        });
      in
        craneLib.mkCargoDerivation (commonArgs // {
          pname = "${name}-wasm-pkg";
          version = "0.1.0";
          inherit cargoArtifacts;
          doCheck = false;

          preBuild = ''
            export HOME="$TMPDIR"
            export CARGO_TARGET_DIR="$TMPDIR/cargo-target"
            export WASM_PACK_CACHE="$TMPDIR/wasm-pack-cache"
            export WASM_PACK_USE_SYS_WASM_BINDGEN=1
          '';

          buildPhaseCargoCommand = "wasm-pack build . --target web --release --mode no-install";

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r pkg/* $out/
            rm -f $out/target.tar.zst
            runHook postInstall
          '';
        });

      flock-wasm-pkg = mkWasmPkg {
        name = "flock";
        path = ./wasm/flock;
        themeColors = true;
      };

      pipedream-wasm-pkg = mkWasmPkg {
        name = "pipedream";
        path = ./wasm/pipedream;
        themeColors = true; # Both use themeColors.json
      };

      # Copy the Nix-built pkg output into the repo paths Nuxt imports from:
      #   ~/wasm/<project>/pkg/<package>
      sync-wasm = pkgs.writeShellApplication {
        name = "sync-wasm";
        runtimeInputs = [ pkgs.coreutils ];
        text = ''
          set -euo pipefail

          echo "Syncing wasm/flock/pkg from Nix store..."
          rm -rf wasm/flock/pkg
          mkdir -p wasm/flock/pkg
          cp -r ${flock-wasm-pkg}/* wasm/flock/pkg/
          chmod -R u+rwX wasm/flock/pkg

          echo "Syncing wasm/pipedream/pkg from Nix store..."
          rm -rf wasm/pipedream/pkg
          mkdir -p wasm/pipedream/pkg
          cp -r ${pipedream-wasm-pkg}/* wasm/pipedream/pkg/
          chmod -R u+rwX wasm/pipedream/pkg

          echo "WASM packages synced."
        '';
      };

      # -----------------------------
      # Node/Nuxt helpers
      # -----------------------------
      build-pages = pkgs.writeShellApplication {
        name = "build-pages";
        runtimeInputs = [ pkgs.nodejs_20 ];
        text = ''
          set -euo pipefail

          export npm_config_cache="$PWD/.npm-cache"

          npm ci

          # Ensure wasm/flock/pkg exists (from reproducible Nix build)
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
        text = ''
          set -euo pipefail

          export npm_config_cache="$PWD/.npm-cache"

          if [ ! -x node_modules/.bin/nuxt ]; then
            echo "node_modules missing; installing dependencies..."
            npm install
          fi

          if [ ! -d wasm/flock/pkg ] || [ ! -d wasm/pipedream/pkg ]; then
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
      devShells.default = pkgs.mkShell {
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

          # Editor tooling
          pkgs.rust-analyzer
        ];

        shellHook = ''
          export RUST_BACKTRACE=1

          # Keep npm cache local to the repo to avoid permission issues with ~/.npm
          export npm_config_cache="$PWD/.npm-cache"

          echo "Entered dev shell"
          echo "  node:  $(node -v)"
          echo "  rustc: $(rustc -V)"
          echo "  wasm-pack: $(wasm-pack --version)"
        '';
      };

      packages = {
        flock-wasm-pkg = flock-wasm-pkg;
        pipedream-wasm-pkg = pipedream-wasm-pkg;
        sync-wasm = sync-wasm;
        build-pages = build-pages;
        dev = dev;
        default = build-pages;
      };

      apps = {
        sync-wasm = flake-utils.lib.mkApp { drv = sync-wasm; };
        build-pages = flake-utils.lib.mkApp { drv = build-pages; };
        dev = flake-utils.lib.mkApp { drv = dev; };
        default = flake-utils.lib.mkApp { drv = build-pages; };
      };
    });
}
