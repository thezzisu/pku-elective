import { useLocalStorage } from '@vueuse/core'

export const localConfig = useLocalStorage(
  'localConfig',
  {
    user: '',
    pass: '',
    secondary: false
  },
  { deep: true }
)
