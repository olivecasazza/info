#!/bin/sh

# install rust and wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y

# build wasm package
wasm-pack build ./wasm/flock --target web

# build nuxt package
npm run build:pages