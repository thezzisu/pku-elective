<template>
  <VCard>
    <VCardTitle>Server Settings</VCardTitle>
    <VDivider />
    <VCardText>
      <VTextField v-model="config.browserPath" label="Browser Path" />
      <VSwitch v-model="config.headless" label="Headless" />
    </VCardText>
    <VCardActions>
      <VBtn @click="load">Load</VBtn>
      <VBtn @click="save">Save</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const config = ref({
  browserPath: '',
  headless: false
})

async function load() {
  config.value = await fetch('http://localhost:6233/config').then((res) => res.json())
}

async function save() {
  await fetch('http://localhost:6233/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config.value)
  })
}

load()
</script>
