#!/bin/sh
set -e

# If nix is present, use the flake for a reproducible build
if command -v nix >/dev/null 2>&1; then
    echo "Nix detected, building with flake..."
    # Ensure we use the build-pages app defined in flake.nix
    nix run .#build-pages
    exit 0
fi

echo "Nix not found, falling back to manual build..."

# install rust and wasm-pack
if ! command -v rustc >/dev/null 2>&1; then
    curl https://sh.rustup.rs -sSf | sh -s -- -y
    . "$HOME/.cargo/env"
fi

if ! command -v wasm-pack >/dev/null 2>&1; then
    curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y
fi

# install node dependencies
npm ci

# build wasm packages
echo "Building wasm/flock..."
wasm-pack build ./wasm/flock/ --target web --release

echo "Building wasm/pipedream..."
wasm-pack build ./wasm/pipedream/ --target web --release

echo "Building wasm/spot..."
wasm-pack build ./wasm/spot/ --target web --release

# build nuxt package
echo "Generating static site..."
npx nuxt generate
