<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm">
      <div v-for="item in category?.items" :key="item.heading" class="mb-2">
        <NuxtLink class="link" :to="item.link">
          {{ item.link }}
        </NuxtLink>
        <br>
        <span class="text">{{ item.text }}</span>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">

// ! this (and router objects) should both be coming
// ! from the same source. [refactor]
const categories = [
  {
    subject: 'animation',
    items: [
      {
        heading: 'Flocking',
        text: 'Simulated flocking behavior based on separation, alignment, and cohesion. Written in Rust, compiled to WASM.',
        link: '/projects/flock'
      },
      {
        heading: 'Ethernet 3D Pipes',
        text: '3D Pipes-style ethernet cables in an 8-bit arcade aesthetic. Written in Rust, compiled to WASM.',
        link: '/projects/pipedream'
      }
    ]
  },
  {
    subject: 'notebooks',
    items: [
      {
        isLocal: false,
        heading: 'Kinematics',
        text: 'An analysis of the kinematics of robotic manipulator.',
        link: '/projects/notebooks/kinematics'
      },
      {
        isLocal: false,
        heading: 'Inverse Kinematics Approximation',
        text: 'Approximation of a 2d inverse kinematic function.',
        link: '/projects/notebooks/inverse-kinematic-approximations'
      }
    ]
  }
]
</script>
