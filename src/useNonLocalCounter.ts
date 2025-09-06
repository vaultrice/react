import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing a numeric counter in NonLocalStorage.
 *
 * Provides functions to increment and decrement the counter value atomically,
 * with error handling and metadata updates.
 *
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param key - The key to store and retrieve the counter value.
 * @param options - Options for NonLocalStorage, including credentials and instance options.
 * @returns A tuple containing:
 * - value: The current counter value.
 * - increment: Function to increment the counter.
 * - decrement: Function to decrement the counter.
 * - error: Any error encountered during operations.
 */
export const useNonLocalCounter = (
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) => {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage(id, key, options)

  /**
   * Increments the counter value in NonLocalStorage.
   * @param val - The amount to increment by (optional).
   * @param opts - Additional options for incrementing (optional).
   */
  const increment = async (val?: number, opts?: { ttl?: number, updatedAt?: number }) => {
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

  /**
   * Decrements the counter value in NonLocalStorage.
   * @param val - The amount to decrement by (optional).
   * @param opts - Additional options for decrementing (optional).
   */
  const decrement = async (val?: number, opts?: { ttl?: number, updatedAt?: number }) => {
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

  return [value?.value, increment, decrement, error, isLoading]
}
