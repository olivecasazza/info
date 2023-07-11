<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm mb-2">
      <div v-for="item in category?.items" :key="item.heading">
        <NuxtLink class="link" :to="item.link">
          {{
            getFullLink(item)
          }}
        </NuxtLink>
        <br>
        <span class="text" v-html="item.text" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">

const host = computed(() => window.location.host)
function getFullLink (item: { link: string }): string {
  return (host.value ?? 'info') + item.link
}

// ! this (and router objects) should both be coming
// ! from the same source. [refactor]
const categories = [
  {
    subject: 'animation',
    items: [
      {
        heading: 'Flocking',
        text: 'Simulated flocking behavior based on separation, alignment, and cohesion. Implemented w/ rust/wasm, inspired by <a class=\'link\' href=\'https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html\'>thecodingtrain.com<a/>.',
        link: '/projects/flock',
        sourceCodeLink:
          'https://github.com/olivecasazza/nullspace/tree/wasm-flock/wasm/src/flock'
      }
    ]
  },
  {
    subject: 'notebooks',
    items: [
      {
        heading: 'Inverse Kinematics Approximation',
        text: 'Apromixation of a 2d inverse kinematic function.',
        link: '/projects/notebooks/2d-inverse-kinematics',
        sourceCodeLink: ''
      }
    ]
  }
]
</script>
