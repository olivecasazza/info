<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm">
      <div v-for="item in category?.items" :key="item.heading" class="mb-2">
        <NuxtLink class="link" :to="item.link">
          {{ item.link }}
        </NuxtLink>
        <br>
        <span class="text">{{ item.text }}</span>
        <template v-if="item.source">
          <br>
          <a :href="item.source" target="_blank" class="text-gray-500 hover:text-gray-300 text-xs">↳ source</a>
        </template>
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
        text: 'Boids algorithm with dynamic species configuration and real-time parameter tuning.',
        link: '/projects/flock',
        source: 'https://github.com/olivecasazza/info/tree/main/wasm/flock'
      },
      {
        heading: 'Ethernet 3D Pipes',
        text: 'Procedural 3D path generation with collision avoidance and random-walk routing.',
        link: '/projects/pipedream',
        source: 'https://github.com/olivecasazza/info/tree/main/wasm/pipedream'
      },
      {
        heading: 'Spot',
        text: 'Quadruped robot with Ray cluster RL training and real-time 3D physics rendering.',
        link: '/projects/spot',
        source: 'https://github.com/olivecasazza/info/tree/main/wasm/spot'
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
