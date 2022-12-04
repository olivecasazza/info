<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="app-view-port home-wrapper overflow-hidden">
    <ul class="ascii-tree text-sm">
      <li>
        <div class="inline app-heading text-xl">contact/</div>
        <ul>
          <li>
            <inline class="text-secondary-400">email: </inline
            >colanzio5@gmail.com
          </li>
          <li>
            <inline class="text-secondary-400">git: </inline
            >github.com/colanzio5
          </li>
        </ul>
      </li>
    </ul>
    <ul class="ascii-tree text-xs overflow-hidden">
      <li>
        <div class="inline app-heading">experience/</div>
        <ul>
          <li v-for="item of experiences" key="item" class="">
            <div class="inline text-highlight-300">{{ item.company }}/</div>
            <ul>
              <li v-for="subItem of item.subItems" :key="subItem.company" class="overflow-x-scroll" >
                <inline class="text-secondary-400 text-xs">{{ subItem.date }}</inline>
                <div class="inline text-xs overflow-x-scroll"> | {{ subItem.description }}</div>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

interface IExperienceItem {
  company: string;
  subItems: {
    date?: string;
    description?: string;
  }[];
}

export default class HomeView extends Vue {
  experiences: IExperienceItem[] = [
    {
      company: 'qualcomm',
      subItems: [
        { description: 'programmer analyst', date: '2021 - current' },
        { description: 'cloud tools software engineer', date: '2020 - 2021' },
      ],
    },
    {
      company: 'voyager space technologies',
      subItems: [
        {
          date: 'jul 2018 - aug 2019',
          description: 'full stack software engineer',
        },
      ],
    },
    {
      company: 'sdsu rocket project',
      subItems: [
        {
          date: 'sep 2015 - jan 2018',
          description: 'full stack software engineer',
        },
      ],
    },
    {
      company: 'san diego state university',
      subItems: [
        {
          date: 'sep 2015 - dec 2019',
          description: 'bachelor’s degree in computer science',
        },
      ],
    },
  ];
}
</script>

<style lang="postcss">
.home-wrapper {
  @apply select-none pt-4 text-white w-full h-full;
}
</style>
