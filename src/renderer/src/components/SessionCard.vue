<template>
  <VCard>
    <VCardTitle>Session {{ props.id }}</VCardTitle>
    <VDivider />
    <VCardText>
      <div class="grid grid-cols-[auto,1fr] gap-2">
        <img :src="captcha" />
        <VTextField v-model.lazy="code" label="Captcha" />
      </div>
      <div ref="logNode" class="h-32 overflow-scroll">
        <pre class="whitespace-pre" v-text="logText"></pre>
      </div>
    </VCardText>
    <VCardActions>
      <VBtn @click="refreshCaptcha">Reload Captcha</VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { localConfig } from '@renderer/config'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  id: string
  target: Array<{ courseName: string; classNo: string }>
}>()

const captcha = ref(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIwAAAABJRU5ErkJggg=='
)
const code = ref('')

const base = `http://localhost:6233/session/${props.id}`

const logText = ref('')
const logNode = ref<HTMLElement>()

function log(msg: unknown) {
  logText.value += `[${new Date().toLocaleTimeString()}] ${msg}\n`
  nextTick(() => {
    logNode.value?.scrollTo(0, logNode.value.scrollHeight)
  })
}

async function login() {
  const resp = await fetch(base + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: localConfig.value.user,
      pass: localConfig.value.pass
    })
  })
  if (!resp.ok) throw new Error('login failed')
}

async function loadList() {
  const resp = await fetch(base + '/loadList', {
    method: 'POST'
  })
  if (!resp.ok) throw new Error('loadList failed')
  return resp.json()
}

async function loadCaptcha() {
  const resp = await fetch(base + '/loadCaptcha', {
    method: 'POST'
  })
  if (!resp.ok) throw new Error('loadCaptcha failed')
  return resp.text()
}

async function refreshCaptcha() {
  const img = await loadCaptcha()
  captcha.value = img
  code.value = ''
}

async function refreshLimit(index: string, seqNo: string, xh: string) {
  const resp = await fetch(base + '/refreshLimit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      index,
      seqNo,
      xh
    })
  })
  if (!resp.ok) {
    throw new Error('refreshLimit failed')
  }
  return resp.json()
}

async function elect(elecUrl: string) {
  const resp = await fetch(base + '/elect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      elecUrl,
      code: code.value,
      xh: localConfig.value.user
    })
  })
  if (!resp.ok) {
    throw new Error('elect failed')
  }
  return resp.json()
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let mounted = true

async function mainLoop() {
  for (; mounted; ) {
    try {
      await login()
      for (;;) {
        try {
          const list = await loadList()
          console.log(list)
          try {
            const img = await loadCaptcha()
            captcha.value = img
            code.value = ''
            while (!code.value) {
              log(`Wait for captcha input`)
              await wait(1000)
            }
            const wanted = props.target
              .map((t) =>
                list.find((i) => i.info.courseName === t.courseName && i.info.classNo === t.classNo)
              )
              .filter((t) => t)
            for (;;) {
              for (const course of wanted) {
                const { electedNum, limitNum } = await refreshLimit(
                  course.info.index,
                  course.info.seqNo,
                  course.info.xh
                )
                if (typeof electedNum !== 'number') {
                  log('refreshLimit failed')
                } else {
                  log(`${course.info.courseName} ${electedNum} ${limitNum}`)
                  if (electedNum < limitNum) {
                    new Notification('Elect Available', {
                      body: course.info.courseName
                    })
                    log(`electing ${course.info.courseName}`)
                    const [success, msg] = await elect(course.actions[0][0])
                    if (success) {
                      log(`electing ${course.info.courseName} success`)
                      new Notification('Elect Success', {
                        body: course.info.courseName
                      })
                      throw new Error('elect success')
                    } else {
                      log(`electing ${course.info.courseName} failed: ${msg}`)
                    }
                  }
                }
                await wait(3000)
              }
            }
          } catch (err) {
            log(err)
          }
        } catch (err) {
          log(err)
          break
        }
      }
    } catch (err) {
      log(err)
    }
  }
}

onMounted(() => {
  mainLoop()
})

onBeforeUnmount(() => {
  mounted = false
})
</script>
