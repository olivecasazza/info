<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">hephaestus</h1>
      <p class="text-gray-400">A bare-metal autoscaler for Kubernetes, written in Rust.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">problem</h2>
      <p>
        Kubernetes can scale pods horizontally, but on bare metal there is no
        equivalent for the machine under them. If a pool is saturated, someone
        walks into the rack or clicks through a BMC web UI. I wanted a
        <code>MetalMachinePool</code> that behaves like a
        <code>Deployment</code>: declare desired size, let the controller
        handle power.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">approach</h2>
      <p>
        Two CRDs — <code>MetalMachine</code> (one host, its BMC credentials,
        its MAC) and <code>MetalMachinePool</code> (min/max replicas and a
        label selector). A
        <a href="https://kube.rs" target="_blank" class="link">kube-rs</a>
        reconciler owns both. Power is driven through IPMI/Redfish for graceful
        off and Wake-on-LAN for cold boot. A Prometheus endpoint exposes
        reconcile latency, BMC errors, and pool saturation.
      </p>
      <CodeBlock :code="crd" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">case study — nixlab edge pool</h2>
      <p>
        The nixlab fleet runs a small edge tier that is idle most of the day.
        With hephaestus it scales 2 → 16 when a Ray job hits the queue and
        drains back down on cordon. Mean time from pool-update to Ready node
        sits around 90&nbsp;s (POST + PXE), dominated by firmware, not the
        controller.
      </p>
      <ProjectFigure
        src="/projects-media/hephaestus-scale-up.gif"
        caption="Pool scaling 2 → 16 in response to a Ray autoscaler request (kubectl get metalmachine -w)."
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">install</h2>
      <CodeBlock :code="install" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://hydra.casazza.io/jobset/hephaestus/main" target="_blank" class="link">Hydra</a> — CI builds on hydra.casazza.io</li>
        <li><a href="https://hephaestus.cachix.org" target="_blank" class="link">cachix</a> — binary cache (<code>hephaestus.cachix.org</code>)</li>
      </ul>
      <p class="text-xs text-gray-500">The GitHub repo is currently private; ping me for access.</p>
    </section>
  </article>
</template>

<script setup lang="ts">
const crd = `apiVersion: hephaestus.io/v1alpha1
kind: MetalMachinePool
metadata: { name: edge }
spec:
  minReplicas: 2
  maxReplicas: 16
  machineSelector:
    matchLabels: { site: edge }`

const install = `# Nix flake (requires repo access)
nix run github:casazza-info/hephaestus -- export-crds | kubectl apply -f -

# Helm (from the private chart path)
helm install hephaestus ./charts/hephaestus`
</script>
