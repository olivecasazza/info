<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">consortium</h1>
      <p class="text-gray-400">ClusterShell rewritten in Rust, with PyO3 bindings and adapters for Nix, Ansible, Slurm, Ray, and SkyPilot.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">problem</h2>
      <p>
        <a href="https://clustershell.readthedocs.org" target="_blank" class="link">ClusterShell</a>
        is the library I reach for when I need to fan a command across a
        cluster — <code>clush -w node[01-16] -- uptime</code> is hard to beat.
        But it's single-process Python, it ties its event loop to its own
        implementation, and it has no first-class hook into Slurm allocations
        or Ray placements. I wanted the same node-set ergonomics with a tokio
        core underneath and a narrower, typed API.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">approach</h2>
      <p>
        A core <code>consortium-crate</code> owns node-set parsing and the
        SSH/rsh fan-out engine. Everything else is an adapter crate —
        <code>-nix</code>, <code>-ansible</code>, <code>-slurm</code>,
        <code>-ray</code>, <code>-skypilot</code> — that turns an environment
        into a node set. Python keeps working via PyO3 (<code>consortium-py</code>),
        so existing ClusterShell scripts migrate one import at a time. A
        dedicated
        <a href="https://github.com/olivecasazza/consortium/tree/main/crates/consortium-test-harness" target="_blank" class="link">test harness</a>
        runs the Python suite against both backends.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">case study — Slurm fan-out</h2>
      <p>
        On a 64-node Slurm allocation, <code>consortium slurm --nodes 64 --
        nvidia-smi</code> resolves the node set from <code>$SLURM_JOB_ID</code>
        and dispatches over persistent SSH multiplexers. End-to-end latency
        lands under the single-process ClusterShell baseline largely because
        connection setup is concurrent, not serial.
      </p>
      <ProjectFigure
        src="/projects-media/consortium-slurm.gif"
        caption="consortium slurm fan-out across a 64-node allocation, merged-output view."
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">install</h2>
      <CodeBlock :code="install" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">usage</h2>
      <CodeBlock :code="usage" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://github.com/olivecasazza/consortium" target="_blank" class="link">source</a> — github.com/olivecasazza/consortium</li>
        <li><a href="https://hydra.casazza.io/jobset/consortium/main" target="_blank" class="link">Hydra</a> — CI builds on hydra.casazza.io</li>
        <li><a href="https://consortium.cachix.org" target="_blank" class="link">cachix</a> — binary cache (<code>consortium.cachix.org</code>)</li>
        <li><a href="https://pypi.org/project/consortium" target="_blank" class="link">PyPI</a> — PyO3 bindings (consortium-py)</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
const install = `# Nix flake
nix run github:olivecasazza/consortium -- -w node[01-16] -- uptime

# Cargo
cargo install consortium-cli

# Python (PyO3 bindings)
pip install consortium`

const usage = `# Fan out a command across a node set
consortium -w node[01-16] -- uptime

# Drive a Slurm allocation
consortium slurm --partition gpu --nodes 4 -- nvidia-smi

# From Python
import consortium
consortium.Task("hostname").run("node[01-16]")`
</script>
