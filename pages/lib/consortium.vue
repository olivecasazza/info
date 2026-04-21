<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">consortium</h1>
      <p class="text-gray-400">A Rust reimplementation of the
        <a href="https://clustershell.readthedocs.org" target="_blank" class="link">ClusterShell</a>
        toolchain. Tokio-based dispatch core with persistent SSH multiplexers,
        eleven workspace crates, four user-facing binaries, and a PyO3
        binding that drops into existing ClusterShell scripts one import
        at a time.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">scope</h2>
      <p>
        Replaces the four ClusterShell binaries (<code>clush</code>,
        <code>clubak</code>, <code>cluset</code>/<code>nodeset</code>) plus
        the Python library, and adds a <code>cast</code> deploy CLI for
        NixOS fleets. Adapter crates resolve a "node set" from a Slurm
        allocation, a Ray placement group, an Ansible inventory, a
        SkyPilot cluster, or a Nix flake's <code>nixosConfigurations</code>;
        the core dispatcher stays scheduler-agnostic.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">workspace</h2>
      <ul class="flex flex-col gap-1">
        <li><code>consortium</code> — node-set parser, async dispatcher, SSH transport.</li>
        <li><code>consortium-py</code> — PyO3 bindings exposing the ClusterShell-compatible API.</li>
        <li><code>consortium-cli</code> — ships <code>claw</code>, <code>molt</code>, <code>pinch</code>, <code>cast</code>.</li>
        <li><code>consortium-nix</code> — fleet config + flake-derived node sets.</li>
        <li><code>consortium-ansible</code> — inventory parser.</li>
        <li><code>consortium-slurm</code> — resolves <code>$SLURM_JOB_ID</code> + partition queries.</li>
        <li><code>consortium-ray</code> — placement-group → node set.</li>
        <li><code>consortium-skypilot</code> — sky cluster → node set.</li>
        <li><code>consortium-test-harness</code> — runs the upstream ClusterShell Python test suite against both backends.</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">binaries</h2>
      <ul class="flex flex-col gap-2">
        <li><code>claw -w 'node[01-16]' -- uptime</code> — fan-out command execution. Replaces <code>clush</code>. Flags: <code>-b</code> coalesce identical output, <code>--copy</code> file transfer, <code>-l</code> remote user.</li>
        <li><code>some_command | molt -b</code> — aggregate <code>node:line</code> stdin into grouped output. Replaces <code>clubak</code>.</li>
        <li><code>pinch -e 'node[1-5]'</code> — node-set algebra. Replaces <code>cluset</code>/<code>nodeset</code>. Operations: <code>-e</code> expand, <code>-f</code> fold, <code>-c</code> count, <code>-i</code> intersect, <code>-x</code> difference.</li>
        <li><code>cast deploy --on 'hp[01-03]' switch</code> — NixOS deployment orchestrator. Reads <code>fleet.json</code>, builds + copies + activates closures across host groups. Subcommands: <code>build</code>, <code>eval</code>, <code>health</code>, <code>status</code>.</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">test-harness contract</h2>
      <p>
        ClusterShell's upstream Python suite covers the node-set parser,
        the event loop, SSH transports, and the CLIs.
        <code>consortium-test-harness</code> runs that suite against both
        the original Python implementation and the
        <code>consortium-py</code> binding, asserting identical results.
        Core changes that break parity get blocked at CI.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">recording — nixlab Mac Mini fan-out</h2>
      <p>
        <code>pinch</code> exercises the parser; <code>claw</code> fans out
        <code>uptime</code> across <code>mm01-mm05</code>;
        <code>molt -b</code> coalesces a kernel-version sweep;
        <code>cast health</code> probes the NixOS build hosts;
        <code>cast eval</code> prints the deployment plan without
        applying it.
      </p>
      <ProjectFigure
        src="/projects-media/consortium-fan-out.gif"
        caption="claw / molt / pinch / cast against mm01-mm05."
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
        <li><a href="https://github.com/olivecasazza/consortium" target="_blank" class="link">github.com/olivecasazza/consortium</a></li>
        <li><a href="https://hydra.casazza.io/jobset/consortium/main" target="_blank" class="link">hydra.casazza.io/jobset/consortium/main</a> — CI</li>
        <li><a href="https://consortium.cachix.org" target="_blank" class="link">consortium.cachix.org</a> — binary cache</li>
        <li><a href="https://pypi.org/project/consortium" target="_blank" class="link">pypi.org/project/consortium</a> — PyO3 bindings</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
const install = `nix run github:olivecasazza/consortium#claw -- -w 'node[01-16]' uptime
cargo install consortium-cli
pip install consortium`

const usage = `# Node-set algebra (no network)
pinch -e 'node[01-05,07]'        # node01 node02 node03 node04 node05 node07
pinch -f node1 node2 node3       # node[1-3]
pinch -i 'node[1-5]' 'node[3-7]' # node[3-5]   (intersection)

# Fan-out a command
claw -w 'node[01-16]' -- uptime
claw -w 'node[01-16]' -b -- 'uname -r'

# Drive a Slurm allocation
claw slurm --partition gpu --nodes 4 -- nvidia-smi

# Coalesce piped output
some_command | molt -b

# Deploy a fleet of NixOS hosts
cast deploy --on 'hp[01-03]' switch

# Python — ClusterShell-compatible
import consortium
task = consortium.Task("hostname")
task.run("node[01-16]")`
</script>
