#!/bin/sh

# install rust and wasm-pack
curl https://sh.rustup.rs -sSf | sh -s -- -y ;
. "$HOME/.cargo/env" ;
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y ;

# install node dependencies
npm install 

# build wasm package
wasm-pack build ./wasm/flock/ --target web

# build nuxt package
npx nuxt generate