<template>
  <div>
    <span>
      <li v-for="item of experiences" :key="item.company" class="flex flex-col mt-1">
        <span class="text-highlight-300">
          {{ item.company }}
        </span>
        <div v-for="subItem of item.subItems" :key="subItem.description">
          <span>
            <span class="text-secondary-300  text-bold">{{ subItem.date.start }}</span>
            - <span class="text-secondary-300  text-bold">{{ subItem.date.end }}</span>
            : <span>{{ subItem.description }}</span>
          </span>
        </div>
      </li>
    </span>
  </div>
</template>

<script setup lang="ts">

interface IExperienceItem {
  company: string;
  subItems: {
    date: { start: string, end: string };
    description: string;
  }[];
}

const experiences: IExperienceItem[] = [
  {
    company: 'Nvidia',
    subItems: [
      { description: 'Senior HPC Data Analyst', date: { start: '2024', end: 'current' } }
    ]
  },
  {
    company: 'Qualcomm',
    subItems: [
      { description: 'Cloud Tools Software Engineer', date: { start: '2021', end: '2023' } },
      { description: 'Programmer Analyst', date: { start: '2020', end: '2021' } }
    ]
  },
  {
    company: 'San Diego State University',
    subItems: [
      {
        date: { start: '2015', end: '2019' },
        description: 'Bachelor’S Degree In Computer Science'
      }
    ]
  },
  {
    company: 'Voyager Space Technologies',
    subItems: [
      {
        date: { start: '2018', end: '2019' },
        description: 'Full Stack Software Engineer'
      }
    ]
  },
  {
    company: 'SDSU Rocket Project',
    subItems: [
      {
        date: { start: '2015', end: '2018' },
        description: 'Systems and Avionics Engineer'
      }
    ]
  }
]
</script>
