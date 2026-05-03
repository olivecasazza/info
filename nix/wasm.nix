# WASM package builds using crane
{ pkgs, craneLib, spotPhysicsSrc }:

let
  # The spot crate's Cargo.toml declares
  #   spot-physics = { path = "../../../skypilot-env/spot/spot-physics" }
  # so we materialize a build root that contains both this repo's wasm/ tree
  # and the skypilot-env spot/ tree at exactly that relative offset:
  #
  #   $mergedRoot/info/wasm/...
  #   $mergedRoot/skypilot-env/spot/spot-physics/
  #   $mergedRoot/skypilot-env/spot/rapier-gym/      (kept for cargo workspace)
  #   $mergedRoot/skypilot-env/spot/Cargo.toml       (the spot workspace)
  #
  # From info/wasm/spot/Cargo.toml the relative path "../../../skypilot-env/
  # spot/spot-physics" then lands inside this same root, so cargo follows the
  # path dep correctly inside the sandbox. Local-dev cargo builds rely on the
  # actual sibling-repo layout under ~/Repositories/.
  mergedSrc = pkgs.runCommand "wasm-spot-merged-src" { } ''
    mkdir -p $out/info $out/skypilot-env
    cp -r ${../wasm} $out/info/wasm
    cp -r ${spotPhysicsSrc}/. $out/skypilot-env/spot/
    chmod -R u+w $out
  '';

  # Source for the entire wasm workspace (includes ui-theme + spot assets +
  # the merged-in spot-physics tree from skypilot-env).
  wasmWorkspaceSrc = pkgs.lib.cleanSourceWith {
    src = mergedSrc;
    filter = path: type:
      (craneLib.filterCargoSources path type)
      || (builtins.match ".*/themeColors\\.json$" (toString path) != null)
      || (builtins.match ".*/assets$" (toString path) != null)
      || (builtins.match ".*/assets/.*" (toString path) != null)
      || (builtins.match ".*\\.(glb|urdf|stl|onnx)$" (toString path) != null);
  };

  # Common args for the entire workspace. sourceRoot tells crane / cargo to
  # treat info/wasm as the workspace root inside the merged tree. cargoLock
  # is set explicitly because crane defaults to looking at the top of the
  # `src` derivation, which is one level above the workspace in our merged
  # layout.
  wasmCommonArgs = {
    src = wasmWorkspaceSrc;
    sourceRoot = "source/info/wasm";
    cargoLock = ../wasm/Cargo.lock;
    cargoToml = ../wasm/Cargo.toml;
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
