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
      flock-wasm-pkg = let
        # craneLib.cleanCargoSource uses a conservative filter that excludes non-standard files.
        # We need `themeColors.json` (consumed by build.rs) included in the build input.
        src = pkgs.lib.cleanSourceWith {
          src = ./wasm/flock;
          filter = path: type:
            (craneLib.filterCargoSources path type)
            || (builtins.match ".*/themeColors\\.json$" (toString path) != null);
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
          pname = "flock-wasm-deps";
        });
      in
        # Use mkCargoDerivation so crane can still stage cargoArtifacts,
        # but run wasm-pack as the build command.
        craneLib.mkCargoDerivation (commonArgs
          // {
            pname = "flock-wasm-pkg";
            version = "0.1.0";

            inherit cargoArtifacts;

            doCheck = false;

            # wasm-pack invokes cargo internally; this still benefits from crane's
            # prepared dependency artifacts.
            #
            # NOTE: wasm-pack wants to write cache/target artifacts; ensure those
            # are in writable locations during the Nix build.
            preBuild = ''
              export HOME="$TMPDIR"
              export CARGO_TARGET_DIR="$TMPDIR/cargo-target"
              export WASM_PACK_CACHE="$TMPDIR/wasm-pack-cache"

              # Important: during Nix builds we use a vendored cargo registry,
              # so wasm-pack cannot `cargo install wasm-bindgen-cli`.
              # Force using the system-provided wasm-bindgen binary instead.
              export WASM_PACK_USE_SYS_WASM_BINDGEN=1
            '';

            # `--mode no-install` is required in our Nix build because crane uses a vendored
            # registry, and wasm-pack's default behavior is to `cargo install wasm-bindgen-cli`.
            buildPhaseCargoCommand = "wasm-pack build . --target web --release --mode no-install";

            installPhase = ''
              runHook preInstall
              mkdir -p $out
              cp -r pkg/* $out/
              rm -f $out/target.tar.zst
              runHook postInstall
            '';
          });

      # Copy the Nix-built pkg output into the repo paths Nuxt imports from:
      #   ~/wasm/<project>/pkg/<package>
      #
      # NOTE: Right now we build these in-dev (wasm-pack) because adding a second
      # crane derivation is a bit more involved. This keeps the workflow simple
      # and extendable: add another entry to the PROJECTS list.
      sync-wasm = pkgs.writeShellApplication {
        name = "sync-wasm";
        runtimeInputs = [ pkgs.coreutils pkgs.wasm-pack pkgs.wasm-bindgen-cli pkgs.binaryen ];
        text = ''
          set -euo pipefail
          for project in "flock" "ethernet-3dpipes"; do
            echo "Building wasm/$project via wasm-pack..."
            rm -rf "wasm/$project/pkg" "wasm/$project/target"
            # `--mode no-install` avoids wasm-pack attempting to install wasm-bindgen.
            wasm-pack build "./wasm/$project" --target web --release --mode no-install
            # Defensive: keep repo pkg clean.
            rm -f "wasm/$project/pkg/target.tar.zst" || true
            # Ensure dev tooling can write.
            chmod -R u+rwX "wasm/$project/pkg" || true
            echo "Synced wasm/$project/pkg"
          done
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

          if [ ! -d wasm/flock/pkg ]; then
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
