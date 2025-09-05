import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing an array in NonLocalStorage with atomic operations.
 */
export const useNonLocalArray = <T extends ValueType>(
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) => {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage(id, key, options)

  const push = async (element: T, opts?: any) => {
    try {
      const meta = await nls.push(key, element, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setArray = async (arr: T[], opts?: any) => {
    try {
      const meta = await nls.setItem(key, arr, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  return [
    (value?.value as T[]) || [],
    { push, setArray },
    error,
    isLoading
  ]
}
