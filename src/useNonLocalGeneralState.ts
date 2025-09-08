import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions, UseNonLocalGeneralStateReturn } from './types'

/**
 * React hook for managing a single value in NonLocalStorage.
 *
 * Provides a simple interface to read and update a value for a given key,
 * with error handling and atomic operations.
 *
 * @template VT - The type of value to store.
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param key - The key to store and retrieve data for.
 * @param options - Options for NonLocalStorage, including credentials and instance options.
 * @returns A tuple containing:
 * - value: The current value for the specified key.
 * - actions: Object with various action methods (setItem, push, splice, merge, setIn, etc.).
 * - error: Any error encountered during operations.
 * - isLoading: Loading state.
 */
export function useNonLocalGeneralState<VT extends ValueType> (
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
): UseNonLocalGeneralStateReturn<VT> {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage<VT>(id, key, options)

  const actions = {
    /**
     * Sets the value for the specified key in NonLocalStorage.
     * @param val - The value to store.
     * @param opts - Additional options for storing the value (optional).
     */
    setItem: async (val: VT, opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => {
      try {
        const meta = await nls.setItem(key, val, opts)
        setValue(meta)
      } catch (err) {
        setError(err)
      }
    },

    /**
     * Appends an element to an array stored at the key.
     * @param element - The element to append.
     * @param opts - Additional options (optional).
     */
    push: async (element: ValueType, opts?: { ttl?: number, updatedAt?: number }) => {
      try {
        const meta = await nls.push(key, element, opts)
        setValue(meta)
      } catch (err) {
        setError(err)
      }
    },

    /**
     * Performs a shallow merge into the stored object.
     * @param objectToMerge - The object to merge.
     * @param opts - Additional options (optional).
     */
    merge: async (objectToMerge: Record<string, ValueType>, opts?: { ttl?: number, updatedAt?: number }) => {
      try {
        const meta = await nls.merge(key, objectToMerge, opts)
        setValue(meta)
      } catch (err) {
        setError(err)
      }
    },

    /**
     * Sets a nested value using dot notation.
     * @param path - The dot-separated path (e.g., 'user.profile.name').
     * @param val - The value to set.
     * @param opts - Additional options (optional).
     */
    setIn: async (path: string, val: ValueType, opts?: { ttl?: number, updatedAt?: number }) => {
      try {
        const meta = await nls.setIn(key, path, val, opts)
        setValue(meta)
      } catch (err) {
        setError(err)
      }
    },

    /**
     * Splices an array stored at the key (remove/replace/insert elements).
     * @param startIndex - The index at which to start changing the array.
     * @param deleteCount - The number of elements to remove.
     * @param items - Optional array of items to insert.
     * @param opts - Additional options (optional).
     */
    splice: async (startIndex: number, deleteCount: number, items?: ValueType[], opts?: { ttl?: number, updatedAt?: number }) => {
      try {
        const meta = await nls.splice(key, startIndex, deleteCount, items, opts)
        setValue(meta)
      } catch (err) {
        setError(err)
      }
    }
  }

  return [value?.value as VT, actions, error, isLoading]
}
