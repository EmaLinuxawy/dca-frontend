import type { Ref } from 'vue'

export function storeAction<T>(
  isLoading: Ref<boolean>,
  error: Ref<string | null>,
  action: () => Promise<T>,
  errorMessage: string
): Promise<T> {
  isLoading.value = true
  error.value = null
  return action()
    .catch((err: any) => {
      error.value = err.response?.data?.detail || errorMessage
      throw err
    })
    .finally(() => {
      isLoading.value = false
    })
}
