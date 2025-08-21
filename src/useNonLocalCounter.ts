import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

export const useNonLocalCounter = (id: string, key: string, options: UseNonLocalStorageOptions) => {
  const [nls, value, setValue,, error, setError] = useNonLocalStorage(id, key, options)

  // function to increment/decrement
  const increment = async (val?: number, opts?: any) => {
    try {
      const meta = await nls.incrementItem(key, val, opts)

      setValue({
        ...value,
        value: meta?.value,
        expiresAt: meta?.expiresAt,
        keyVersion: meta?.keyVersion,
        createdAt: meta?.createdAt,
        updatedAt: meta?.updatedAt
      })
    } catch (err) {
      setError(err)
    }
  }

  const decrement = async (val?: number, opts?: any) => {
    try {
      const meta = await nls.decrementItem(key, val, opts)

      setValue({
        ...value,
        value: meta?.value,
        expiresAt: meta?.expiresAt,
        keyVersion: meta?.keyVersion,
        createdAt: meta?.createdAt,
        updatedAt: meta?.updatedAt
      })
    } catch (err) {
      setError(err)
    }
  }

  return [value?.value, increment, decrement, error]
}
