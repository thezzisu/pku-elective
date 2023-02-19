<template>
  <VContainer>
    <VRow>
      <VCol>
        <SettingsCard />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <ConfigCard />
      </VCol>
    </VRow>
    <VRow>
      <VCol>
        <VCard>
          <VCardTitle>Control</VCardTitle>
          <VCardText>
            <div
              v-for="(course, i) of wantedCourses"
              :key="i"
              class="grid grid-cols-[1fr,1fr,auto] gap-2"
            >
              <VTextField v-model="course.courseName" label="Course Name" :readonly="started" />
              <VTextField v-model="course.classNo" label="Class No." :readonly="started" />
              <VBtn :disabled="started" @click="wantedCourses.splice(i, 1)">Remove</VBtn>
            </div>
          </VCardText>
          <VCardActions>
            <VBtn :disabled="started" @click="wantedCourses.push({ courseName: '', classNo: '' })">
              Add Course
            </VBtn>
            <VBtn @click="start">Start</VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
    <VRow v-for="sess of sessions" :key="sess.id">
      <VCol>
        <SessionCard :id="sess.id" :target="sess.target" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import ConfigCard from '@renderer/components/ConfigCard.vue'
import SettingsCard from '@renderer/components/SettingsCard.vue'
import SessionCard from '@renderer/components/SessionCard.vue'
import { ref } from 'vue'

const wantedCourses = ref<Array<{ courseName: string; classNo: string }>>([])
const started = ref(false)
const sessions = ref<any[]>([])

async function start() {
  started.value = true
  await fetch('http://localhost:6233/start', {
    method: 'POST'
  })
  const clone = JSON.parse(JSON.stringify(wantedCourses.value))
  const result: any[] = []
  for (let i = 0; i < wantedCourses.value.length; i++) {
    const id = await fetch('http://localhost:6233/session', {
      method: 'POST'
    }).then((res) => res.text())
    // rotate wantedCourses to make sure each session has different target
    result.push({ id, target: JSON.parse(JSON.stringify(clone)) })
    clone.push(clone.shift())
  }
  sessions.value = result
}
</script>
