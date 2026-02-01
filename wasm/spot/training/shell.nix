{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = with pkgs; [
    python3
    python3Packages.pip
    python3Packages.virtualenv
  ];
  shellHook = ''
    if [ ! -d ".venv-submit" ]; then
      python3 -m venv .venv-submit
      source .venv-submit/bin/activate
      pip install 'ray[default]==2.52.0' 'ray[rllib]==2.52.0' 'ray[serve]==2.52.0'
    else
      source .venv-submit/bin/activate
    fi
  '';
}
