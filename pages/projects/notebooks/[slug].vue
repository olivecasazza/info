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

// Derive title from slug (e.g. "parallelcoords" -> "Parallelcoords", "inverse-kinematic-approximations" -> "Inverse Kinematic Approximations")
const title = computed(() => {
  return slug.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

// Map certain slugs back to their real source locations in the notebooks repo
const sourceUrl = computed(() => {
  const s = slug.value
  const base = 'https://github.com/olivecasazza/notebooks/blob/main/content'
  
  if (s === 'kinematics') return `${base}/SDSU-CS556-Workspace/a4/p4.py`
  if (s === 'inverse-kinematic-approximations') return `${base}/SDSU-CS556-Workspace/a3/Assignment 3, Part 2.py`
  
  // Assume everything else is under pyodide/wigglystuff for these specific examples,
  // or default to a generic guess. The original vue files had specific paths.
  if (s === 'treemap' || s === 'parallelcoords' || s === 'polynomials') {
    return `${base}/pyodide/wigglystuff/${s}.ipynb`
  }
  
  return `${base}/${s}.py`
})

const notebookPath = computed(() => `https://olivecasazza.github.io/notebooks/notebooks/${slug.value}.html`)
</script>