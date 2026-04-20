<template>
  <div class="flex flex-col gap-4 text-sm max-w-2xl">
    <h1 class="text-lg text-primary-300">bird-nix</h1>
    <p>
      Combinator library implementing the birds from Raymond Smullyan's
      <em>To Mock a Mockingbird</em> — I, M, K, KI, B, C, L, W, S, V, Y — as
      pure Nix expressions. Includes a DSL, AST compiler, pretty-printer,
      property-based testing framework, and a self-bootstrapping test harness.
    </p>
    <p>
      Packaged as a Nix flake that other flakes can import:
    </p>
    <pre class="text-xs text-gray-400 overflow-x-auto">{{ usage }}</pre>
    <div class="flex gap-4">
      <a href="https://github.com/olivecasazza/bird-nix" target="_blank" class="link">source</a>
    </div>
  </div>
</template>

<script setup lang="ts">
const usage = `inputs.bird-nix.url = "github:olivecasazza/bird-nix";

# As a full library:
let bn = inputs.bird-nix.lib {}; in bn.I "hello"

# Just the combinators:
inherit (inputs.bird-nix.lib {}) I M K KI B C L W S V Y;`
</script>
