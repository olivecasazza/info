<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">consortium</h1>
      <p class="text-gray-400">A Rust reimplementation of the
        <a href="https://clustershell.readthedocs.org" target="_blank" class="link">ClusterShell</a>
        toolchain. Ships <code>claw</code>, <code>molt</code>, <code>pinch</code>,
        and <code>cast</code> binaries, with adapter crates for Nix flakes,
        Ansible inventories, Slurm allocations, Ray placement groups, and
        SkyPilot clusters. Python compatibility via PyO3.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">why rewrite ClusterShell</h2>
      <p>
        ClusterShell is the de facto Python library for HPC cluster
        scripting — node-set algebra, fan-out over SSH, output coalescing.
        It works, but the engine is single-process Python with its own
        event loop, has no first-class hook into modern schedulers
        (Slurm/Ray/SkyPilot), and the CLI surface (<code>clush</code>,
        <code>clubak</code>, <code>cluset</code>) doesn't compose cleanly
        with declarative deploy tooling like Nix flakes.
      </p>
      <p>
        consortium keeps the node-set syntax and the Python API — existing
        scripts migrate one import at a time — but moves the dispatch
        engine onto Tokio with persistent SSH multiplexers, and exposes a
        small adapter trait so a "node set" can come from
        <code>$SLURM_JOB_ID</code>, a Ray placement group, an Ansible
        inventory, or a Nix flake's <code>nixosConfigurations</code>.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">workspace layout</h2>
      <p>
        Eleven crates in one workspace. <code>consortium</code> is the core
        (node-set parser, async dispatcher, SSH transport). Adapter crates
        (<code>consortium-{nix,ansible,slurm,ray,skypilot}</code>) each
        implement the same trait — turn an environment-specific concept
        into a node set — so the engine doesn't grow scheduler-specific
        knowledge. <code>consortium-py</code> is the PyO3 binding;
        <code>consortium-cli</code> ships the four user-facing binaries;
        <code>consortium-test-harness</code> runs the original ClusterShell
        Python test suite against both the Python and Rust backends.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">the four binaries</h2>
      <ul class="flex flex-col gap-2">
        <li><code>claw -w 'node[01-16]' -- uptime</code> — replaces
          <code>clush</code>. Parallel command execution with optional
          output gathering (<code>-b</code>) and file copy
          (<code>--copy</code>).</li>
        <li><code>some_command | molt -b</code> — replaces
          <code>clubak</code>. Reads <code>node:line</code> stdin, groups
          identical output across nodes.</li>
        <li><code>pinch -e 'node[1-5]'</code> — replaces
          <code>cluset</code>/<code>nodeset</code>. Node-set algebra:
          expand, fold, intersect, difference, count.</li>
        <li><code>cast deploy --on 'hp[01-03]' switch</code> — NixOS
          deployment orchestrator built on the same engine. Reads a
          <code>fleet.json</code>, builds + copies + activates closures
          across host groups, with health probes for build hosts.</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">case study — nixlab fan-out</h2>
      <p>
        The recording below runs against the nixlab Mac Mini fleet
        (<code>mm01–mm05</code>). <code>pinch</code> shows the node-set
        parser; <code>claw</code> fans out <code>uptime</code>;
        <code>molt -b</code> coalesces a kernel-version query;
        <code>cast health</code> probes the NixOS build hosts;
        <code>cast eval</code> shows the work plan for a deploy without
        actually applying.
      </p>
      <ProjectFigure
        src="/projects-media/consortium-fan-out.gif"
        caption="claw / molt / pinch / cast against the nixlab mm01–mm05 fleet."
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">test harness</h2>
      <p>
        ClusterShell ships an extensive Python test suite covering the
        node-set parser, the event loop, SSH transports, and the CLIs.
        <code>consortium-test-harness</code> runs that same suite against
        both backends — original Python and the
        <code>consortium-py</code> Rust binding — and reports any
        divergence. New core changes have to keep the harness green; that's
        the contract that lets existing ClusterShell users adopt one
        import at a time.
      </p>
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
        <li><a href="https://hydra.casazza.io/jobset/consortium/main" target="_blank" class="link">Hydra</a> — CI builds at hydra.casazza.io</li>
        <li><a href="https://consortium.cachix.org" target="_blank" class="link">cachix</a> — binary cache <code>consortium.cachix.org</code></li>
        <li><a href="https://pypi.org/project/consortium" target="_blank" class="link">PyPI</a> — <code>consortium-py</code> bindings</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
const install = `# Nix flake (gives you all four binaries)
nix run github:olivecasazza/consortium#claw -- -w 'node[01-16]' uptime

# Cargo
cargo install consortium-cli

# Python (PyO3 bindings, ClusterShell-compatible API)
pip install consortium`

const usage = `# Node-set algebra (no network)
pinch -e 'node[01-05,07]'        # node01 node02 node03 node04 node05 node07
pinch -f node1 node2 node3       # node[1-3]
pinch -i 'node[1-5]' 'node[3-7]' # node[3-5]   (intersection)

# Fan-out a command
claw -w 'node[01-16]' -- uptime
claw -w 'node[01-16]' -b -- 'uname -r'    # group identical output

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
