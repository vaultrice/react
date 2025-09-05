import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing an object in NonLocalStorage with atomic operations.
 */
export const useNonLocalObject = <T extends Record<string, ValueType> = Record<string, ValueType>>(
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) => {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage(id, key, options)

  const merge = async (objectToMerge: Partial<T>, opts?: any) => {
    try {
      const meta = await nls.merge(key, objectToMerge as ValueType, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setIn = async (path: string, val: any, opts?: any) => {
    try {
      const meta = await nls.setIn(key, path, val, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setObject = async (obj: T, opts?: any) => {
    try {
      const meta = await nls.setItem(key, obj, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  return [
    (value?.value as T) || {} as T,
    { merge, setIn, setObject },
    error,
    isLoading
  ]
}
