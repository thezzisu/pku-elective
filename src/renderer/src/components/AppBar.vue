<template>
  <VAppBar>
    <VAppBarNavIcon variant="text" @click.stop="emits('navIconClick')" />
    <VToolbarTitle>PKUElective</VToolbarTitle>
    <VSpacer />
  </VAppBar>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (ev: 'navIconClick'): void
}>()
</script>
