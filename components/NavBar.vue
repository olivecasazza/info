<template>
  <div v-if="pathItems?.length != 0" class="p-1 flex flex-row">
    <div v-for="(item, index) of pathItems" :key="index">
      <span>
        <NuxtLink v-if="!isActiveItem(item)" class="link" :to="getTo(item)">{{ item }}</NuxtLink>
        <div v-if="isActiveItem(item)" class="rainbow-text-animated">{{ item }}</div>

        <span v-if="pathItems[index+1]" class="ml-1 mr-1">></span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const pathItems = computed(() => {
  const invalidPaths = [
    'projects',
    'notebooks'
  ]
  const fullPath = useRoute().fullPath
  const items = ['home', ...fullPath.slice(1, fullPath.length).split('/').filter(e => e !== '' && !invalidPaths.includes(e))].map(e => ` /${e}`)
  return items
})

function isActiveItem (item: String) {
  const currentPage = (useRoute().fullPath.split('/').pop())
  if (item.replace('/', '').trim() === ((currentPage?.trim() ?? '') === '' ? 'home' : currentPage?.trim())) { return true }
  return false
}

function getTo (item: string) {
  switch (item.trim()) {
    case '/home':
      return '/'
    case '/2d-inverse-kinematics':
      return '/projects/notebooks/2d-inverse-kinematics'
    default:
      return '/'
  }
}
</script>
