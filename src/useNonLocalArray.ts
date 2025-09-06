import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing an array in NonLocalStorage with atomic operations.
 *
 * Provides reactive access to an array stored under `key` on a NonLocalStorage instance.
 * The hook returns the current array (defaulting to []), an actions object with atomic
 * helpers (push, setArray), an error value and a loading flag.
 *
 * Features:
 * - Atomic server-side push to append elements safely across concurrent clients.
 * - Convenience setter to replace the whole array.
 * - Automatic subscription to remote updates (unless options.bind === false).
 * - Error handling and isLoading state for async operations.
 *
 * @template T - Element type stored in the array.
 * @param id - NonLocalStorage instance id (room/store id).
 * @param key - Key identifying the array value.
 * @param options - Hook options (credentials, instanceOptions, bind).
 * @returns A tuple:
 *   - array: T[] — current array value (or [] when missing)
 *   - actions: { push(element: T, opts?: any): Promise<void>, setArray(arr: T[], opts?: any): Promise<void> }
 *   - error: any — any error that occurred during operations
 *   - isLoading: boolean — true while initial load or an async get/set is in progress
 *
 * Example:
 * const [items, { push, setArray }, error, isLoading] =
 *   useNonLocalArray<{ id:number, text:string }>('room1', 'todos', { credentials: {...} })
 *
 * await push({ id: 1, text: 'Buy milk' })
 * await setArray([{ id: 1, text: 'Buy milk' }])
 */
export const useNonLocalArray = <T extends ValueType>(
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) => {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage(id, key, options)

  const push = async (element: T, opts?: { ttl?: number, updatedAt?: number }) => {
    try {
      const meta = await nls.push(key, element, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setArray = async (arr: T[], opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => {
    try {
      const meta = await nls.setItem(key, arr, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const splice = async (
    startIndex: number,
    deleteCount: number,
    items?: T[],
    opts?: { ttl?: number, updatedAt?: number }
  ) => {
    try {
      const meta = await nls.splice(key, startIndex, deleteCount, items, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  return [
    (value?.value as T[]) || [],
    { push, splice, setArray },
    error,
    isLoading
  ]
}
