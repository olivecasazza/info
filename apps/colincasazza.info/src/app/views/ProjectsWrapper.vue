<template>
  <div class="app-view-port w-full h-full text-white text-left break-words">
    <div v-for="category in categories" :key="category?.subject">
      <div v-for="item in category?.items" :key="item.heading">
        <div class="app-heading">
          {{ item.heading }}
        </div>
        <router-link class="link" :to="item.link">{{
          getFullLink(item)
        }}</router-link>
        <div class="text-sm" v-html="item.text"></div>
      </div>
      <br>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class ProjectsWrapper extends Vue {
  getFullLink(item: { link: string }): string {
    return (window.location.origin || 'colincasazza.info') + item.link;
  }

  // ! this (and router objects) should both be coming
  // ! from the same source. [refactor]
  categories = [
    {
      subject: 'animation',
      items: [
        {
          heading: 'flocking',
          // eslint-disable-next-line max-len
          text: `simulated flocking behavior based on separation, alignment, and cohesion. implemented w/ rust/wasm, inspired by <a class='link' href='https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html'>thecodingtrain.com<a/>.`,
          link: '/projects/three/flock',
          sourceCodeLink:
            'https://github.com/colanzio5/colincasazza.info/tree/wasm-flock/wasm/src/flock',
        }
      ],
    },
    {
      subject: 'notebooks',
      items: [
        {
          heading: 'inverse kinematics approximation',
          text: 'apromixation of a 2d inverse kinematic function.',
          link: '/projects/notebooks/2d-inverse-kinematics',
          sourceCodeLink: '',
        },
      ],
    },
  
  ];
}
</script>
