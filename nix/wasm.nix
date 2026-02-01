# WASM package builds using crane
{ pkgs, craneLib }:

let
  # Source for the entire wasm workspace (includes ui-theme)
  wasmWorkspaceSrc = pkgs.lib.cleanSourceWith {
    src = ../wasm;
    filter = path: type:
      (craneLib.filterCargoSources path type)
      || (builtins.match ".*/themeColors\\.json$" (toString path) != null)
      || (builtins.match ".*/assets$" (toString path) != null)
      || (builtins.match ".*/assets/.*" (toString path) != null)
      || (builtins.match ".*\\.(glb|urdf|stl|onnx)$" (toString path) != null);
  };

  # Common args for the entire workspace
  wasmCommonArgs = {
    src = wasmWorkspaceSrc;
    pname = "wasm-workspace";
    version = "0.1.0";
    strictDeps = true;
    cargoExtraArgs = "--locked --target wasm32-unknown-unknown";
    nativeBuildInputs = [
      pkgs.wasm-pack
      pkgs.wasm-bindgen-cli
      pkgs.binaryen
      pkgs.pkg-config
    ];
  };

  # Build ALL workspace dependencies once (shared across packages)
  wasmWorkspaceDeps = craneLib.buildDepsOnly wasmCommonArgs;

  mkWasmPkg = { name, subdir }:
    craneLib.mkCargoDerivation (wasmCommonArgs // {
      pname = "${name}-wasm-pkg";
      version = "0.1.1";  # Bumped to invalidate cache (tar.zst fix)
      cargoArtifacts = wasmWorkspaceDeps;
      cargoExtraArgs = "--locked --target wasm32-unknown-unknown -p ${name}";
      doCheck = false;

      preBuild = ''
        export HOME="$TMPDIR"
        export CARGO_TARGET_DIR="$TMPDIR/cargo-target"
        export WASM_PACK_CACHE="$TMPDIR/wasm-pack-cache"
        export WASM_PACK_USE_SYS_WASM_BINDGEN=1
        cd ${subdir}
      '';

      buildPhaseCargoCommand = "wasm-pack build . --target web --release --mode no-install";

      installPhase = ''
        runHook preInstall
        mkdir -p $out
        cp -r pkg/* $out/
        # Remove crane cache artifacts and any symlinks
        rm -f $out/target.tar.zst $out/target.tar.zst.prev
        find $out -type l -delete
        runHook postInstall
      '';
    });

in {
  flock = mkWasmPkg { name = "flock"; subdir = "flock"; };
  pipedream = mkWasmPkg { name = "pipedream"; subdir = "pipedream"; };
  spot = mkWasmPkg { name = "spot"; subdir = "spot"; };
}
