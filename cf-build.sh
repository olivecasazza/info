#!/bin/sh

# install rust and wasm-pack
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y ;
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y ;

# build wasm package
npm run build:wasm

# build nuxt package
npm run build:pages