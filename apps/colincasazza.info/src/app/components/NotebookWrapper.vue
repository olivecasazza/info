<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class NotebookWrapper extends Vue {
  @Prop() notebookPath!: string;
}
</script>

<template>
  <iframe
    :ref="notebookPath"
    :src="notebookPath"
    sandbox="allow-same-origin allow-scripts"
    class="w-full h-full app-view-port"
  ></iframe>
</template>

<style lang="postcss" scoped>
.jp-Notebook {
  @apply w-full h-full bg-transparent text-xs;
}

.jp-Notebook > * {
  background: transparent;
}
</style>
