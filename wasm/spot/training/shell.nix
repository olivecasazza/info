{ pkgs ? import <nixpkgs> {} }:

# FHS environment for PyTorch + CUDA RL training on NixOS
# Provides libstdc++, CUDA libs, and Python with proper library paths
let
  fhs = pkgs.buildFHSEnv {
    name = "spot-training-env";
    targetPkgs = p: with p; [
      python313
      python313Packages.pip
      python313Packages.virtualenv

      # Native libs that PyTorch/CUDA need
      stdenv.cc.cc.lib   # libstdc++.so.6
      zlib
      libGL
      glib

      # CUDA toolkit
      cudaPackages.cudatoolkit
      cudaPackages.cudnn
      linuxPackages.nvidia_x11
    ];
    runScript = "bash";
    profile = ''
      export CUDA_PATH=${pkgs.cudaPackages.cudatoolkit}
      export LD_LIBRARY_PATH=/usr/lib:$LD_LIBRARY_PATH
    '';
  };
in
pkgs.mkShell {
  packages = [ fhs ];
  shellHook = ''
    echo "Run 'spot-training-env' to enter the FHS environment with CUDA support"
    echo "Then: python3 -m venv /opt/spot-training && pip install torch ..."
    echo "For W&B logging: pip install wandb && wandb login"
  '';
}
