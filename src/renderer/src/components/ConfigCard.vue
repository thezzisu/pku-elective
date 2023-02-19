<template>
  <VCard>
    <VCardTitle>Local Configuration</VCardTitle>
    <VDivider />
    <VCardText>
      <VTextField v-model="localConfig.user" label="IAAA ID" />
      <VTextField v-model="localConfig.pass" label="IAAA Pass" />
      <VSwitch v-model="localConfig.secondary" label="Secondary Degree" />
    </VCardText>
  </VCard>
</template>

<script setup lang="ts">
import { localConfig } from '@renderer/config'
</script>
