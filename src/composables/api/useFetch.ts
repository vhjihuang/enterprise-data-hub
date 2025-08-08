import { ref, computed } from 'vue'
import type { Ref } from 'vue'

interface UseFetchOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  loading: Ref<boolean>
  execute: (url?: string, options?: RequestInit) => Promise<T>
  reset: () => void
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions<T> = {}
): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const execute = async (fetchUrl?: string, fetchOptions?: RequestInit): Promise<T> => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(fetchUrl || url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...fetchOptions,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      data.value = result
      
      options.onSuccess?.(result)
      return result
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error')
      error.value = errorObj
      options.onError?.(errorObj)
      throw errorObj
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    data.value = null
    error.value = null
    loading.value = false
  }

  // 如果设置了 immediate，立即执行
  if (options.immediate) {
    execute()
  }

  return {
    data,
    error,
    loading,
    execute,
    reset,
  }
} 