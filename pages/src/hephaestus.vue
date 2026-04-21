<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">hephaestus</h1>
      <p class="text-gray-400">A bare-metal lifecycle and autoscaling
        operator for Kubernetes, written in Rust against
        <a href="https://kube.rs" target="_blank" class="link">kube-rs</a>.
        Reconciles two CRDs into power events on physical hosts via
        IPMI, Redfish, or Wake-on-LAN.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">scope</h2>
      <p>
        Pod autoscaling and cloud autoscaling are solved problems; bare
        metal is not. Existing on-prem provisioners
        (<a href="https://metal3.io" target="_blank" class="link">Metal3</a>,
        <a href="https://docs.tinkerbell.org" target="_blank" class="link">Tinkerbell</a>)
        target hyperscale provisioning pipelines and pull in their own
        ecosystems. Hephaestus is a small operator that does one thing:
        keep a labelled pool of bare-metal hosts at a target replica count
        by power-cycling their BMCs.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">CRDs</h2>
      <p>
        <code>MetalMachine</code> — one host. Spec: BMC address + protocol
        (<code>Ipmi</code> | <code>Redfish</code> | <code>WakeOnLan</code>),
        credentials secret reference, network config (static IP +
        interface), hardware profile (CPU cores, memory MiB, optional GPU
        product/count/VRAM), pool reference, desired <code>online</code>
        state, K8s node labels.
        Status tracks <code>phase</code>
        (<code>Registering | Inspecting | Available | Provisioning |
        JoiningCluster | Ready | Deprovisioning | PoweringOff | Error</code>),
        BMC reachability, current power state, and the K8s node name
        once the host has joined.
      </p>
      <p>
        <code>MetalMachinePool</code> — a label-selected group with
        desired <code>replicas</code>, a <code>scalingStrategy</code>
        (<code>PowerCycle</code> for warm hosts, <code>PxeProvision</code>
        for clean re-installs), a <code>scaleDownPolicy</code>
        (<code>LeastUtilized</code> | <code>Newest</code>), and a
        <code>cooldownSeconds</code> guard. The pool controller diffs
        Ready vs desired and instructs the per-machine controller to
        power on or off.
      </p>
      <CodeBlock :code="crd" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">workspace</h2>
      <ul class="flex flex-col gap-1">
        <li><code>hephaestus-api</code> — CRD types, schemars-generated OpenAPI.</li>
        <li><code>hephaestus</code> — controller binary; kube reconciler, IPMI/Redfish/WoL transports, Prometheus metrics on <code>:8080/metrics</code>.</li>
        <li><code>hephaestus-grpc</code> — gRPC service for external schedulers to query pool state.</li>
        <li><code>hephaestus-operator-lib</code> — shared telemetry + <code>export-crds</code> CLI scaffold; reused by sibling operators (e.g. <a href="https://github.com/casazza-info/rerun-operator" target="_blank" class="link">rerun-operator</a>).</li>
      </ul>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">production deployment — nixlab fleet</h2>
      <p>
        Runs on the <a href="/lib/nixlab" class="link">nixlab</a> cluster
        managing three ProLiant workers (<code>hp01-03</code>, IPMI) and
        five Mac Mini agents (<code>mm01-05</code>, Wake-on-LAN). The ML
        training pool scales 0 → 3 ProLiants when SkyPilot tasks queue
        and drains back down on cordon. End-to-end from
        <code>kubectl patch metalmachinepool</code> to a Ready node sits
        around 90&nbsp;s, dominated by firmware POST + PXE; the controller
        reconciles in tens of milliseconds.
      </p>
      <ProjectFigure
        src="/projects-media/hephaestus-scale-up.gif"
        caption="kubectl get metalmachine -w during a 2 → 16 scale-up triggered by a Ray pool patch."
      />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">install</h2>
      <CodeBlock :code="install" />
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://hydra.casazza.io/jobset/hephaestus/main" target="_blank" class="link">hydra.casazza.io/jobset/hephaestus/main</a> — CI</li>
        <li><a href="https://hephaestus.cachix.org" target="_blank" class="link">hephaestus.cachix.org</a> — binary cache</li>
        <li><code>ghcr.io/casazza-info/hephaestus</code> — container image</li>
      </ul>
      <p class="text-xs text-gray-500">Source repository is private. Contact for access.</p>
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

const install = `nix run github:casazza-info/hephaestus -- export-crds | kubectl apply -f -

helm install hephaestus ./charts/hephaestus -n heph-system --create-namespace

# Or as a Kubenix module
imports = [ flake.inputs.hephaestus.kubenixModules.hephaestus ];`
</script>
