<template>
  <VNavigationDrawer>
    <VList nav>
      <VListItem v-for="(item, i) in nav" :key="i" v-bind="item" />
    </VList>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
const nav = [{ prependIcon: 'mdi-home', title: 'Home', value: 'home', to: '/' }]
</script>
