<template>
  <ClientOnly>
    <div v-for="category in categories" :key="category?.subject" class="flex flex-col text-sm">
      <div v-for="item in category?.items" :key="item.heading" class="mb-2">
        <NuxtLink class="link" :to="item.link" :target="item.isLocal ? '' : '_blank'">
          {{
            getFullLink(item)
          }}
        </NuxtLink>
        <br>
        <span class="text">{{ item.text }}</span>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">

const host = computed(() => window.location.host)

function getFullLink (item: { link: string, isLocal: boolean } = { link: '', isLocal: false }): string {
  return item.isLocal ? ((host.value ?? 'info') + item.link) : item.link
}

// ! this (and router objects) should both be coming
// ! from the same source. [refactor]
const categories = [
  {
    subject: 'animation',
    items: [
      {
        heading: 'Flocking',
        text: 'Simulated flocking behavior based on separation, alignment, and cohesion. Written in Rust, compiled to WASM.',
        link: '/projects/flock',
        isLocal: true
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
        link: 'https://olivecasazza.github.io/notebooks/lab?path=SDSU-CS556-Workspace/a4/p4.ipynb'
      },
      {
        isLocal: false,
        heading: 'Inverse Kinematics Approximation',
        text: 'Approximation of a 2d inverse kinematic function.',
        link: 'https://olivecasazza.github.io/notebooks/lab?path=SDSU-CS556-Workspace/a3/Assignment 3, Part 2.ipynb'
      }
    ]
  }
]
</script>
