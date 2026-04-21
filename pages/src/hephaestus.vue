<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">hephaestus</h1>
      <p class="text-gray-400">A bare-metal lifecycle and autoscaling operator
        for Kubernetes, written in Rust against
        <a href="https://kube.rs" target="_blank" class="link">kube-rs</a>.
        Treats physical hosts as first-class K8s objects and reconciles power
        + pool size through their BMCs.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">why</h2>
      <p>
        Kubernetes scales pods. Cluster-autoscaler scales cloud
        instances. Neither does anything for the bare-metal host: a saturated
        on-prem pool means someone in the rack or clicking a vendor BMC web
        UI. Existing tools (<a href="https://metal3.io" target="_blank" class="link">Metal3</a>,
        <a href="https://docs.tinkerbell.org" target="_blank" class="link">Tinkerbell</a>)
        target hyperscale provisioning pipelines and pull in their own CRD
        ecosystems. I wanted a small operator that reads two CRDs and just
        keeps a labelled host pool at a target replica count by power-cycling
        the underlying BMCs.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">CRDs</h2>
      <p>
        <code>MetalMachine</code> describes one host: BMC address + protocol
        (IPMI / Redfish / WakeOnLAN), credentials secret, network config,
        hardware profile (CPU/memory/GPU), and a pool reference. Status
        tracks <code>phase</code>
        (<code>Registering | Inspecting | Available | Provisioning |
        JoiningCluster | Ready | Deprovisioning | PoweringOff | Error</code>),
        BMC reachability, current power state, and the K8s node name once
        the host has joined.
      </p>
      <p>
        <code>MetalMachinePool</code> is a label-selected group of
        <code>MetalMachine</code>s with desired <code>replicas</code>, a
        <code>scalingStrategy</code>
        (<code>PowerCycle</code> for warm hosts, <code>PxeProvision</code> for
        clean re-installs), and a <code>scaleDownPolicy</code>
        (<code>LeastUtilized | Newest</code>). The pool controller diffs
        Ready vs desired and instructs the per-machine controller to power
        on or off, with a configurable cooldown to avoid thrash.
      </p>
      <CodeBlock :code="crd" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">workspace shape</h2>
      <p>
        Four crates:
        <code>hephaestus-api</code> (CRD types, schemars-generated OpenAPI),
        <code>hephaestus</code> (the controller binary — kube reconciler,
        IPMI/Redfish/WoL transports, Prometheus metrics on
        <code>:8080/metrics</code>),
        <code>hephaestus-grpc</code> (a small gRPC service for external
        schedulers to query pool state), and
        <code>hephaestus-operator-lib</code> (shared telemetry +
        <code>export-crds</code> CLI scaffolding, reused by sibling
        operators). The shared lib was extracted while building
        <a href="https://github.com/casazza-info/rerun-operator" target="_blank" class="link">rerun-operator</a>,
        which now consumes it via git dep.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">case study — nixlab fleet</h2>
      <p>
        Live in production on the
        <a href="/lib/nixlab" class="link">nixlab</a> cluster. Manages three
        ProLiant workers (<code>hp01-03</code>) plus five Mac Mini agents
        (<code>mm01-05</code>). Power events flow through IPMI for the
        ProLiants and Wake-on-LAN for the Macs (no BMC). The ML training
        pool scales 0 → 3 ProLiants when SkyPilot tasks queue up, and the
        edge pool stays cold until a request drives it back up. End-to-end
        from <code>kubectl patch metalmachinepool</code> to a Ready node
        sits around 90&nbsp;s, dominated by firmware POST + PXE — the
        controller itself reconciles in tens of milliseconds.
      </p>
      <ProjectFigure
        src="/projects-media/hephaestus-scale-up.gif"
        caption="Pool scaling 2 → 16 (kubectl get metalmachine -w against a Ray-driven scale-up)."
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">install</h2>
      <CodeBlock :code="install" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://hydra.casazza.io/jobset/hephaestus/main" target="_blank" class="link">Hydra</a> — CI builds at hydra.casazza.io</li>
        <li><a href="https://hephaestus.cachix.org" target="_blank" class="link">cachix</a> — binary cache <code>hephaestus.cachix.org</code></li>
        <li><code>ghcr.io/casazza-info/hephaestus</code> — container image</li>
      </ul>
      <p class="text-xs text-gray-500">The GitHub repo is currently private; ping me for access.</p>
    </section>
  </article>
</template>

<script setup lang="ts">
const crd = `apiVersion: heph.nixlab.io/v1alpha1
kind: MetalMachinePool
metadata: { name: ml-training, namespace: heph-system }
spec:
  replicas: 3
  selector: { role: ml-worker }
  scalingStrategy: PowerCycle
  scaleDownPolicy: LeastUtilized
  cooldownSeconds: 300
---
apiVersion: heph.nixlab.io/v1alpha1
kind: MetalMachine
metadata: { name: hp01, namespace: heph-system, labels: { role: ml-worker } }
spec:
  bmc:
    address: ipmi://192.168.1.221
    protocol: Ipmi
    credentialsSecretRef: hp01-bmc
  networkConfig:
    address: 192.168.1.121/24
    interface: bond0
  hardware:
    cpuCores: 16
    memoryMib: 65536
    gpu: { product: "NVIDIA RTX 5000", count: 1, vramMib: 16384 }
  poolRef: ml-training
  online: true`

const install = `# Nix flake (requires repo access)
nix run github:casazza-info/hephaestus -- export-crds | kubectl apply -f -

# Helm chart (in the workspace at charts/hephaestus)
helm install hephaestus ./charts/hephaestus -n heph-system --create-namespace

# Or as a Kubenix module — reuses the shared library scaffold
imports = [ flake.inputs.hephaestus.kubenixModules.hephaestus ];`
</script>
