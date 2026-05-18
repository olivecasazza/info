<template>
  <NotebookWrapper
    :title="title"
    :source-url="sourceUrl"
    :notebook-path="notebookPath"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from '#imports'
import NotebookWrapper from '~/components/NotebookWrapper.vue'

const route = useRoute()
const slug = computed(() => {
  const p = route.params.slug
  return Array.isArray(p) ? p[0] : p
})

const legacyWigglystuffSlugs = new Set(['parallelcoords', 'treemap', 'polynomials'])
const notebookSlug = computed(() => legacyWigglystuffSlugs.has(slug.value) ? 'wigglystuff' : slug.value)

const titles: Record<string, string> = {
  'wigglystuff': 'Wigglystuff Demos',
  'kinematics': 'Kinematics',
  'inverse-kinematic-approximations': 'Inverse Kinematics Approximation'
}

const title = computed(() => {
  if (titles[notebookSlug.value]) return titles[notebookSlug.value]

  return notebookSlug.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

const sourceUrl = computed(() => {
  const s = notebookSlug.value
  const base = 'https://github.com/olivecasazza/notebooks/blob/main/content'

  if (s === 'kinematics') return `${base}/SDSU-CS556-Workspace/a4/p4.py`
  if (s === 'inverse-kinematic-approximations') return `${base}/SDSU-CS556-Workspace/a3/Assignment 3, Part 2.py`
  if (s === 'wigglystuff') return `${base}/pyodide/wigglystuff/wigglystuff_demos.py`

  return `${base}/${s}.py`
})

const notebookPath = computed(() => `https://olivecasazza.github.io/notebooks/notebooks/${notebookSlug.value}.html`)
</script>
