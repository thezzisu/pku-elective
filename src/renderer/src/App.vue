<template>
  <VApp>
    <AppBar @nav-icon-click="nav = !nav" />
    <AppNav v-model="nav" />
    <VMain>
      <RouterView />
    </VMain>
  </VApp>
</template>

<script lang="ts" setup>
import AppNav from '@renderer/components/AppNav.vue'
import AppBar from '@renderer/components/AppBar.vue'

import { ref } from 'vue'

const nav = ref<boolean>()
</script>
