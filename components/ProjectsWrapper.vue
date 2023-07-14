<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm">
      <div v-for="item in category?.items" :key="item.heading" class="mb-2">
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
        link: '/projects/flock'
      }
    ]
  },
  {
    subject: 'notebooks',
    items: [
      {
        heading: 'Kinematics',
        text: 'Relatively in depth analysis of the kinematics of robotic manipulator.',
        link: '/projects/notebooks/kinematics'
      },
      {
        heading: 'Inverse Kinematics Approximation',
        text: 'Approximation of a 2d inverse kinematic function.',
        link: '/projects/notebooks/inverse-kinematic-approximations'
      }
    ]
  }
]
</script>
