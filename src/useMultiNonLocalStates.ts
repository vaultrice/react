import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing multiple values in NonLocalStorage.
 *
 * Allows you to read and update multiple keys atomically, with error handling.
 *
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param keys - Array of keys to manage.
 * @param options - Options for NonLocalStorage, including credentials and instance options.
 * @returns A tuple containing:
 * - values: The current values for the specified keys.
 * - setItems: Function to set multiple items at once.
 * - error: Any error encountered during operations.
 */
export const useMultiNonLocalStates = (
  id: string,
  keys: Array<string>,
  options: UseNonLocalStorageOptions
) => {
  const [nls, values, setValues,, error, setError, isLoading] = useNonLocalStorage(id, keys, options)

  /**
   * Sets multiple items in NonLocalStorage.
   * @param items - An object mapping keys to value/option objects.
   */
  const setItems = async (
    items: Record<string, { value: ValueType, ttl?: number, ifAbsent?: boolean }>
  ) => {
    try {
      const res = await nls.setItems(items)
      setValues({
        ...values,
        ...res
      })
    } catch (err) {
      setError(err)
    }
  }

  return [values, setItems, error, isLoading]
}
