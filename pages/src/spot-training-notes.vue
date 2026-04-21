<template>
  <article class="flex flex-col gap-5 text-sm max-w-2xl leading-relaxed">
    <header class="flex flex-col gap-1">
      <h1 class="text-lg text-primary-300">spot training — build notes</h1>
      <p class="text-gray-400">How the Spot quadruped RL policy gets
        trained on the nixlab fleet and ends up in a browser-drivable
        demo. Scroll-down links open specific training runs in
        <a href="https://app.rerun.io" target="_blank" class="link">app.rerun.io</a>
        — each is a raw <code>.rrd</code> recording hosted in
        <code>gs://nixlab-spot-reruns/</code> that the public
        Rerun viewer streams directly.</p>
    </header>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">what is Spot</h2>
      <p>
        A twelve-joint quadruped modeled after Boston Dynamics Spot,
        described by a URDF with eighteen STL meshes under
        <code>wasm/spot/assets/</code>. The same model is used for
        training (server-side, Rapier3D via a PyO3 crate) and for
        inference (client-side, Rapier3D compiled to WASM and driven
        from the browser). The only thing that differs between the
        two is the policy backend: Python + PyTorch during training,
        ONNX Runtime via <code>ort</code> in the WASM build.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">physics — one crate, two targets</h2>
      <p>
        <code>spot-physics</code> is a small Rust crate that wraps
        <a href="https://rapier.rs" target="_blank" class="link">Rapier3D</a>
        with Spot-specific scaffolding (joint configuration, motor
        control, foot-contact detection, terrain generators). A sibling
        <code>spot-rapier</code> crate adds PyO3 bindings so the Python
        training loop gets a drop-in Gym environment
        (<code>SpotEnvRapier</code>). The same <code>spot-physics</code>
        crate compiles to WASM for the browser demo. That eliminates the
        usual sim-to-sim gap — the policy sees bit-exact physics in
        training and deployment.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">RL loop — RLlib PPO, six behaviors</h2>
      <p>
        Training is
        <a href="https://docs.ray.io/en/latest/rllib" target="_blank" class="link">RLlib</a>
        PPO on the old API stack (<code>RAY_TRAIN_V2_ENABLED=0</code>),
        50&nbsp;M timesteps per run, learning rate schedule 3e-4 → 1e-5,
        gamma 0.99, lambda 0.95, clip 0.2, batch 4096, minibatch 1024,
        5 epochs. Policy is a 256-128-64 tanh MLP with a free-log-std
        head over twelve continuous joint targets. Observations are 50
        dimensions: 45 physics state + a 5-behavior one-hot.
      </p>
      <p>
        Six behaviors are conditioned on the observation one-hot:
        <code>walk</code>, <code>terrain</code>, <code>climb</code>,
        <code>balance</code>, <code>sprint</code>, <code>forage</code>.
        Each has its own reward-weight preset
        (<code>REWARD_PRESETS</code> in <code>python/spot_rapier/env.py</code>)
        and tends to produce visibly different gaits. A curriculum
        callback ramps the commanded velocity from 0 → 1 over the first
        30&nbsp;% of training and terrain difficulty from 0 → 1 between
        20–60&nbsp;%, so the early policy has an easier problem.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">instrumentation — Rerun to disk, then GCS</h2>
      <p>
        Two callbacks are composed into a single
        <code>TrainingCallbacks</code> class:
        <code>AutoCheckpointCallback</code> saves RLlib checkpoints to
        <code>/tmp/spot_checkpoints</code> (mounted on a Longhorn PVC)
        on every new best-reward and every N iterations.
        <code>RemoteRerunCallback</code> initializes a
        <a href="https://rerun.io" target="_blank" class="link">Rerun</a>
        recording stream and <code>rr.save()</code>s to
        <code>/tmp/spot.rrd</code>. On every
        <code>on_train_result</code> the callback logs aggregate
        metrics (reward min/mean/max, episode length, learner stats,
        throughput) keyed on the training iteration.
      </p>
      <p>
        When the training process exits — on job completion, pod
        termination, or anything in between — an <code>EXIT</code>
        trap in the container's shell wrapper uploads
        <code>/tmp/spot.rrd</code> to
        <code>gs://nixlab-spot-reruns/spot/&lt;behavior&gt;/&lt;UTC&gt;-&lt;host&gt;.rrd</code>
        via a writer service account mounted from a SOPS-encrypted K8s
        Secret. Object retention is 90 days. The bucket has an
        <code>allUsers: roles/storage.objectViewer</code> binding and
        permissive CORS so <code>app.rerun.io</code> can fetch a
        recording directly.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">infrastructure — K8s training pods, tofunix storage</h2>
      <p>
        A behavior-parameterized Kubenix module
        (<code>modules/k8s/hpc/spot-training.nix</code>) generates one
        Deployment per active behavior. Each pod pins to a GPU node
        (<code>seir</code> + its two RTX&nbsp;5000s is the canonical
        target; <code>hp01-03</code> and <code>contra</code> are
        alternates), clones the
        <a href="https://github.com/olivecasazza/info" target="_blank" class="link">info repo</a>
        in a <code>fetch-code</code> init container, installs
        <code>torch+cu128</code> and the Rust toolchain via a second
        init, then builds <code>spot-rapier</code> as a maturin wheel
        via pip's PEP 517 hook. The main container runs
        <code>train_rapier.py</code> with the exit trap described
        above.
      </p>
      <p>
        The GCS bucket, writer SA, JSON key, and public-read + CORS
        bindings are all declared in terranix
        (<code>infra/gcp/default.nix</code>); an
        <code>allUsers</code> binding is gated behind the org-level
        Domain Restricted Sharing policy and only applies after an
        explicit exemption.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">browse the runs</h2>
      <p>
        Each link below opens the live Rerun viewer on a specific
        <code>.rrd</code> from the bucket. The URL pattern is:
      </p>
      <CodeBlock :code="urlPattern" />
      <p>
        Files land as runs complete; recent uploads first. Until the
        first training run finishes, the placeholders below point at
        examples that will be populated; the format is stable.
      </p>
      <ul class="flex flex-col gap-1">
        <li>
          <a :href="viewerUrl('spot/walk/latest.rrd')" target="_blank" class="link">walk — latest</a>
          <span class="text-xs text-gray-500 ml-2">episode reward, learner entropy, timesteps/sec over 50 M steps</span>
        </li>
        <li>
          <a :href="viewerUrl('spot/terrain/latest.rrd')" target="_blank" class="link">terrain — latest</a>
          <span class="text-xs text-gray-500 ml-2">curriculum ramp visible in terrain_difficulty + reward components</span>
        </li>
        <li>
          <a :href="viewerUrl('spot/climb/latest.rrd')" target="_blank" class="link">climb — latest</a>
        </li>
        <li>
          <a :href="viewerUrl('spot/balance/latest.rrd')" target="_blank" class="link">balance — latest</a>
        </li>
        <li>
          <a :href="viewerUrl('spot/sprint/latest.rrd')" target="_blank" class="link">sprint — latest</a>
        </li>
        <li>
          <a :href="viewerUrl('spot/forage/latest.rrd')" target="_blank" class="link">forage — latest</a>
          <span class="text-xs text-gray-500 ml-2">battery-collection reward components + energy decay</span>
        </li>
      </ul>
      <p class="text-xs text-gray-500">
        Browse the full object index:
        <a :href="bucketIndex" target="_blank" class="link">{{ bucketIndex }}</a>
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">run it yourself</h2>
      <p>
        The trained ONNX policy ships into the
        <NuxtLink to="/src/spot" class="link">WASM demo</NuxtLink>
        — same Rapier3D, same URDF, now driven in the browser at
        frame-rate. Terrain selection + camera controls are on the
        <NuxtLink to="/src/spot-training" class="link">training dashboard page</NuxtLink>.
      </p>
    </section>

    <section class="flex flex-col gap-2">
      <h2 class="text-sm text-primary-300">links</h2>
      <ul class="flex flex-col gap-1">
        <li><a href="https://github.com/olivecasazza/info/tree/main/wasm/spot" target="_blank" class="link">github.com/olivecasazza/info/tree/main/wasm/spot</a> — Rapier3D crates + Python env</li>
        <li><a href="https://github.com/casazza-info/nixlab/tree/main/modules/k8s/hpc/spot-training.nix" target="_blank" class="link">nixlab training Kubenix module</a></li>
        <li><a href="https://github.com/casazza-info/nixlab/tree/main/infra/gcp" target="_blank" class="link">nixlab GCP terranix</a> — bucket + writer SA</li>
        <li><a href="https://hydra.casazza.io/jobset/info/main" target="_blank" class="link">hydra.casazza.io/jobset/info/main</a> — CI</li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
const BUCKET = "nixlab-spot-reruns"
const BASE = `https://storage.googleapis.com/${BUCKET}`

function viewerUrl(objectPath: string): string {
  const obj = `${BASE}/${objectPath}`
  return `https://app.rerun.io/?url=${encodeURIComponent(obj)}`
}

const urlPattern = `https://app.rerun.io/?url=\
https://storage.googleapis.com/nixlab-spot-reruns/spot/<behavior>/<recording>.rrd`

const bucketIndex = `${BASE}?prefix=spot/`
</script>
