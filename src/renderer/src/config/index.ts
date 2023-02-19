import { useLocalStorage } from '@vueuse/core'

export const localConfig = useLocalStorage(
  'localConfig',
  {
    user: '',
    pass: ''
  },
  { deep: true }
)
