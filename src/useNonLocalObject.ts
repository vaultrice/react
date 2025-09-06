import type { ValueType } from '@vaultrice/sdk'
import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

/**
 * React hook for managing an object stored in NonLocalStorage with atomic helpers.
 *
 * This hook exposes a reactive object value plus an actions object that provides
 * atomic operations implemented by the underlying @vaultrice/sdk NonLocalStorage:
 * - merge: shallowly merges properties into the stored object (creates object if missing)
 * - setIn: sets a nested value using a dot-path (creates parents as needed)
 * - setObject: replaces the whole object
 *
 * The hook keeps local state in sync with remote updates (unless options.bind === false),
 * returns any operation errors and exposes an isLoading flag for initial load / async ops.
 *
 * @template T - Shape of the stored object (defaults to Record<string, ValueType>)
 * @param id - NonLocalStorage instance id (room/store id)
 * @param key - Key identifying the stored object
 * @param options - Hook options (credentials, instanceOptions, bind)
 * @returns A tuple:
 *   - object: T — current object value (defaults to {} when missing)
 *   - actions: { merge(objectToMerge: Partial<T>, opts?): Promise<void>, setIn(path: string, val: any, opts?): Promise<void>, setObject(obj: T, opts?): Promise<void> }
 *   - error: any — error encountered during operations
 *   - isLoading: boolean — true while initial load or an async get/set is in progress
 *
 * Example:
 * const [user, { merge, setIn, setObject }, error, isLoading] =
 *   useNonLocalObject<{ name?:string, profile?:{ avatar?:string } }>('room1', 'user', { credentials: {...} })
 *
 * // shallow merge
 * await merge({ name: 'Alice' })
 *
 * // set nested
 * await setIn('profile.avatar', 'avatar.jpg')
 *
 * // replace whole object
 * await setObject({ name: 'Alice', profile: { avatar: 'avatar.jpg' } })
 */
export const useNonLocalObject = <T extends Record<string, ValueType> = Record<string, ValueType>>(
  id: string,
  key: string,
  options: UseNonLocalStorageOptions
) => {
  const [nls, value, setValue,, error, setError, isLoading] = useNonLocalStorage(id, key, options)

  const merge = async (objectToMerge: Partial<T>, opts?: { ttl?: number, updatedAt?: number }) => {
    try {
      const meta = await nls.merge(key, objectToMerge as ValueType, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setIn = async (path: string, val: any, opts?: { ttl?: number, updatedAt?: number }) => {
    try {
      const meta = await nls.setIn(key, path, val, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  const setObject = async (obj: T, opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => {
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
