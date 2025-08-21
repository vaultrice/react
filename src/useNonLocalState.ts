import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing a single value in NonLocalStorage.
 *
 * Provides a simple interface to read and update a value for a given key,
 * with error handling.
 *
 * @template VT - The type of value to store.
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param key - The key to store and retrieve data for.
 * @param options - Options for NonLocalStorage, including credentials and instance options.
 * @returns A tuple containing:
 * - value: The current value for the specified key.
 * - setItem: Function to set the value for the key.
 * - error: Any error encountered during operations.
 */
export function useNonLocalState<VT extends ValueType> (
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) {
  const [nls, value, setValue,, error, setError] = useNonLocalStorage<VT>(id, key, options)

  /**
   * Sets the value for the specified key in NonLocalStorage.
   * @param val - The value to store.
   * @param opts - Additional options for storing the value (optional).
   */
  const setItem = async (val: ValueType, opts?: any) => {
    try {
      const meta = await nls.setItem(key, val, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  return [value?.value as VT, setItem, error]
}
