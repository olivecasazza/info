{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    (pkgs.python311.withPackages (ps: [ ps.trimesh ps.scipy ps.numpy ]))
  ];
}
