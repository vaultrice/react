import type { ItemType, ValueType } from '@vaultrice/sdk'
import { getNonLocalStorage } from './nlsInstances'
import type { UseGeneralOptions } from './types'

/**
 * Creates a simple store interface for a single key in NonLocalStorage.
 * Provides fetch and post methods for retrieving and updating the value.
 *
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param key - The key to store and retrieve data for.
 * @param options - General options including credentials and instance options.
 * @returns An object with `fetch` and `post` methods:
 * - fetch: Retrieves the current value for the key.
 * - post: Sets a new value for the key.
 */
export const createNonLocalStore = (id: string, key: string, options: UseGeneralOptions) => {
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  return {
    /**
     * Fetches the value for the specified key from NonLocalStorage.
     * @returns A promise resolving to the item value or undefined.
     */
    fetch: (): Promise<ItemType | undefined> => { return nls.getItem(key) },

    /**
     * Stores a new value for the specified key in NonLocalStorage.
     * @param value - The value to store.
     * @returns A promise resolving to the stored item metadata or undefined.
     */
    post: (value: ValueType): Promise<ItemType | undefined> => { return nls.setItem(key, value) }
  }
}
