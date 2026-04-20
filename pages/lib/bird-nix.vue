<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">bird-nix</h1>
      <p class="text-gray-400">Raymond Smullyan's <em>To Mock a Mockingbird</em>, in pure Nix.</p>
    </header>

    <section class="flex flex-col gap-2">
      <p>
        The birds of combinatory logic — I, M, K, KI, B, C, L, W, S, V, Y —
        written as pure Nix expressions, with a DSL, AST compiler,
        pretty-printer, property-based tests, and a tvix-eval wasm playground.
        No <code>builtins</code> tricks; the combinators are one-line lambdas
        and everything else is built on top of them.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">the birds</h2>
      <div class="overflow-x-auto">
        <table class="text-xs w-full border-collapse">
          <thead class="text-gray-400">
            <tr>
              <th class="text-left pr-3 pb-1 font-normal">name</th>
              <th class="text-left pr-3 pb-1 font-normal">aka</th>
              <th class="text-left pr-3 pb-1 font-normal">rule</th>
              <th class="text-left pb-1 font-normal">type</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in birds" :key="b.name" class="align-top">
              <td class="pr-3 py-1 text-highlight-300">{{ b.name }}</td>
              <td class="pr-3 py-1 text-gray-300">{{ b.aka }}</td>
              <td class="pr-3 py-1 text-gray-200"><code>{{ b.rule }}</code></td>
              <td class="py-1 text-gray-400"><code>{{ b.type }}</code></td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="text-xs text-gray-400 flex flex-col gap-0.5 mt-1">
        <li v-for="b in birds" :key="b.name"><span class="text-highlight-300">{{ b.name }}</span> — {{ b.description }}.</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">a few laws</h2>
      <p>
        Once the rules are in scope the identities fall out by reduction.
        <code>S K K = I</code>: Starling distributes to two Kestrels, each of
        which keeps only its first argument, so you get <code>x</code> back —
        identity without writing identity.
        <code>W K = I</code>: Warbler duplicates into Kestrel, and Kestrel
        throws the duplicate away — identity again, from a different angle.
        <code>V x y K = x</code> and <code>V x y KI = y</code>: Vireo is a
        church-encoded pair, and the selector is whichever bird you hand it.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">play</h2>
      <p class="text-gray-400 text-xs">
        Real Nix, compiled to wasm with
        <a href="https://tvix.dev" target="_blank" class="link">tvix-eval</a>,
        wired to an xterm.js line-discipline REPL. Press Enter to evaluate.
      </p>
      <ClientOnly>
        <BirdNixRepl />
      </ClientOnly>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">install</h2>
      <CodeBlock :code="install" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://github.com/olivecasazza/bird-nix" target="_blank" class="link">source</a> — github.com/olivecasazza/bird-nix</li>
        <li><a href="https://olivecasazza.github.io/bird-nix/" target="_blank" class="link">demo</a> — the full playground (Monaco editor + REPL)</li>
        <li><a href="https://hydra.casazza.io/jobset/bird-nix/main" target="_blank" class="link">Hydra</a> — CI builds on hydra.casazza.io</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
import birdData from '~/public/bird-nix-playground/bird-data.json'

const birds = birdData.birdList

const install = `inputs.bird-nix.url = "github:olivecasazza/bird-nix";

# As a full library:
let bn = inputs.bird-nix.lib {}; in bn.I "hello"

# Or just the combinators:
inherit (inputs.bird-nix.lib {}) I M K KI B C L W S V Y;`
</script>
