<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm">
      <div v-for="item in category?.items" :key="item.heading" class="mb-2">
        <NuxtLink class="link" :to="item.link">
          {{ item.link }}
        </NuxtLink>
        <br>
        <span class="text">{{ item.text }}</span>
        <div v-if="item.links?.length" class="flex flex-wrap gap-x-3 text-xs mt-0.5">
          <a v-for="l in item.links" :key="l.label" :href="l.url" target="_blank" class="text-gray-500 hover:text-gray-300">↳&nbsp;{{ l.label }}</a>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
interface ItemLink { label: string; url: string }
interface Item {
  heading: string
  text: string
  link: string
  links?: ItemLink[]
}
interface Category { subject: string; items: Item[] }

// ! this (and router objects) should both be coming
// ! from the same source. [refactor]
const categories: Category[] = [
  {
    subject: 'libraries',
    items: [
      {
        heading: 'bird-nix',
        text: 'Combinator library from "To Mock a Mockingbird" — I, M, K, B, C, W, S, V, Y — as pure Nix, with compiler, DSL, and property-based testing.',
        link: '/lib/bird-nix',
        links: [
          { label: 'demo', url: 'https://olivecasazza.github.io/bird-nix/' },
          { label: 'source', url: 'https://github.com/olivecasazza/bird-nix' },
          { label: 'Hydra', url: 'https://hydra.casazza.io/jobset/bird-nix/main' }
        ]
      },
      {
        heading: 'consortium',
        text: 'Rust rewrite of ClusterShell with PyO3 Python bindings. Ships a CLI plus adapters for Nix, Ansible, Slurm, Ray, and SkyPilot for parallel command execution across HPC clusters.',
        link: '/lib/consortium',
        links: [
          { label: 'source', url: 'https://github.com/olivecasazza/consortium' },
          { label: 'Hydra', url: 'https://hydra.casazza.io/jobset/consortium/main' },
          { label: 'cachix', url: 'https://consortium.cachix.org' }
        ]
      }
    ]
  },
  {
    subject: 'projects',
    items: [
      {
        heading: 'hephaestus',
        text: 'Bare-metal Kubernetes operator reconciling MetalMachine and MetalMachinePool CRDs via IPMI/Redfish BMC control and Wake-on-LAN. Built on kube-rs with Prometheus metrics and a Helm chart.',
        link: '/src/hephaestus',
        links: [
          { label: 'source', url: 'https://github.com/casazza-info/hephaestus' },
          { label: 'Helm chart', url: 'https://github.com/casazza-info/hephaestus/tree/main/charts/hephaestus' },
          { label: 'Hydra', url: 'https://hydra.casazza.io/jobset/hephaestus/main' },
          { label: 'cachix', url: 'https://hephaestus.cachix.org' }
        ]
      },
      {
        heading: 'Flocking',
        text: 'Boids algorithm with dynamic species configuration and real-time parameter tuning.',
        link: '/src/flock',
        links: [
          { label: 'demo', url: '/src/flock' },
          { label: 'source', url: 'https://github.com/olivecasazza/info/tree/main/wasm/flock' }
        ]
      },
      {
        heading: 'Ethernet 3D Pipes',
        text: 'Procedural 3D path generation with collision avoidance and random-walk routing.',
        link: '/src/pipedream',
        links: [
          { label: 'demo', url: '/src/pipedream' },
          { label: 'source', url: 'https://github.com/olivecasazza/info/tree/main/wasm/pipedream' }
        ]
      },
      {
        heading: 'Spot',
        text: 'Quadruped robot with Ray cluster RL training and real-time 3D physics rendering.',
        link: '/src/spot',
        links: [
          { label: 'demo', url: '/src/spot' },
          { label: 'training', url: '/src/spot-training' },
          { label: 'source', url: 'https://github.com/olivecasazza/info/tree/main/wasm/spot' }
        ]
      }
    ]
  },
  {
    subject: 'notebooks',
    items: [
      {
        heading: 'Kinematics',
        text: 'An analysis of the kinematics of robotic manipulator.',
        link: '/projects/notebooks/kinematics',
        links: [
          { label: 'source', url: 'https://github.com/olivecasazza/SDSU-CS556-Workspace/blob/master/a4/p4.ipynb' }
        ]
      },
      {
        heading: 'Inverse Kinematics Approximation',
        text: 'Approximation of a 2d inverse kinematic function.',
        link: '/projects/notebooks/inverse-kinematic-approximations',
        links: [
          { label: 'source', url: 'https://github.com/olivecasazza/SDSU-CS556-Workspace/blob/master/a3/Assignment%203%2C%20Part%202.ipynb' }
        ]
      }
    ]
  }
]
</script>
