{
  description = "Info site — Dioxus panel-kit workspace";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay.url = "github:oxalica/rust-overlay";
    crane.url = "github:ipetkov/crane";

    # Panel workspace library — source only, not a flake.
    # Cargo.toml uses path = "../panel-kit"; prePatch recreates this in Nix builds.
    panel-kit = {
      url = "github:olivecasazza/panel-kit/feat/snap-grid-toggles";
      flake = false;
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    rust-overlay,
    crane,
    panel-kit,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [(import rust-overlay)];
        };

        rustToolchain = p:
          p.rust-bin.stable.latest.default.override {
            extensions = ["rust-src" "rustfmt" "clippy"];
            targets = ["wasm32-unknown-unknown"];
          };

        craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;

        # Stitch the repo into the expected layout for crane builds.
        # Cargo.toml uses "../panel-kit" — we recreate that via prePatch.
        src = pkgs.lib.cleanSourceWith {
          src = ./.;
          filter = path: type: let
            rel = pkgs.lib.removePrefix "${toString ./.}/" (toString path);
          in
            (craneLib.filterCargoSources path type)
            || builtins.match ".*\\.(html|css|json)$" rel != null
            || builtins.match "app/ui/public/.*" rel != null;
        };

        commonArgs = {
          inherit src;
          pname = "info-ui";
          version = "0.1.0";
          strictDeps = true;
          CARGO_BUILD_TARGET = "wasm32-unknown-unknown";
          cargoToml = ./app/ui/Cargo.toml;
          cargoLock = ./Cargo.lock;
          sourceRoot = "source/app/ui";

          # Recreate panel-kit as sibling so path = "../panel-kit" resolves.
          prePatch = ''
            chmod -R u+w ../../..
            cp -rL ${panel-kit.outPath} ../../../panel-kit
            chmod -R u+w ../../../panel-kit
          '';
        };

        cargoArtifacts = craneLib.buildDepsOnly (commonArgs // {doCheck = false;});

        info-ui = craneLib.buildTrunkPackage (commonArgs
          // {
            inherit cargoArtifacts;
            wasm-bindgen-cli = pkgs.wasm-bindgen-cli;
          });

        # GitHub Pages build with public URL prefix
        pages = craneLib.buildTrunkPackage (commonArgs
          // {
            inherit cargoArtifacts;
            wasm-bindgen-cli = pkgs.wasm-bindgen-cli;
            trunkExtraBuildArgs = "--public-url /info/";
          });

        devShell = import ./nix/devshell.nix {
          inherit pkgs;
          rust = rustToolchain pkgs;
        };
      in {
        packages = {
          inherit info-ui pages;
          default = info-ui;
        };

        hydraJobs = {
          inherit info-ui pages;
        };

        devShells.default = devShell;
      }
    );
}
