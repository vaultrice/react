import { useState, useEffect } from 'react'
import type { ItemType, ItemsType, NonLocalStorage, ValueType } from '@vaultrice/sdk'
import type { UseNonLocalStorageOptions, UseNonLocalStorageStringReturn, UseNonLocalStorageArrayReturn } from './types'

import { getNonLocalStorage } from './nlsInstances'

/**
 * Retrieves one or more items from NonLocalStorage and updates state.
 *
 * @template VT - Value type
 * @param nls - The NonLocalStorage instance.
 * @param key - The key or array of keys to retrieve.
 * @param set - State setter function to update values.
 * @returns The retrieved item(s).
 */
async function getItem<VT> (
  nls: NonLocalStorage,
  key: string | Array<string>,
  set: Function
) {
  let res

  if (typeof key === 'string') {
    res = await nls.getItem<VT>(key)
    if (set) set({ [`${key}`]: res })
  } else {
    res = await nls.getItems(key)
    if (set) set(res)
  }

  return res
}

/**
 * React hook for accessing and updating values in NonLocalStorage.
 *
 * Handles both single key and multiple key scenarios, providing state, setters, async getters, and error handling.
 *
 * @template VT - Value type
 * @template T - Key type (string or array of strings)
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param key - The key or array of keys to manage.
 * @param options - Options for NonLocalStorage, including credentials and instance options.
 * @returns A tuple containing:
 * - NonLocalStorage instance
 * - value(s) for the key(s)
 * - setter function for value(s)
 * - async getter for value(s)
 * - error state
 * - error setter
 */
export function useNonLocalStorage<VT extends ValueType, T extends string | Array<string> = string> (
  id: string,
  key: T,
  options: UseNonLocalStorageOptions
): T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn {
  const [values, setValues] = useState<ItemsType | undefined>()
  const [error, setError] = useState<any>()

  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)
  const bind = options?.bind ?? true

  useEffect(() => {
    if (!nls) return

    try {
      getItem<VT>(nls, key, setValues)
    } catch (err) {
      setError(err)
    }

    const getHandler = (key: string) => {
      return function handler (item: ItemType) {
        setValues(prevValues => ({
          ...prevValues,
          [`${key}`]: item
        }))
      }
    }

    // we need to keep the handler functions to unbind
    // eslint-disable-next-line no-unused-vars
    const handlers: { [key: string]: (item: ItemType & { prop: string }) => void } = {}

    if (bind) {
      const keys = Array.isArray(key) ? key : [key]

      keys.forEach(k => {
        const handler = getHandler(k)
        handlers[k] = handler

        nls.on('setItem', k, handler)
      })
    }

    // unbind
    return () => {
      if (bind) {
        Object.keys(handlers).forEach(k => {
          nls.off('setItem', k, handlers[k])
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  if (typeof key === 'string') {
    /**
     * Async getter for the single item.
     * @returns Promise resolving to the item value or undefined.
     */
    const getValue = async (): Promise<ItemType | undefined> => {
      try {
        const result = await nls.getItem(key)
        return result
      } catch (err) {
        setError(err)
      }
    }

    /**
     * Setter for the single item.
     * @param val - The new value to set.
     */
    const setValue = (val: ItemType | undefined) => {
      if (!val) return
      setValues(prevValues => ({
        ...prevValues,
        [`${key}`]: val
      }))
    }

    return [nls, values ? values[key] : undefined, setValue, getValue, error, setError] as T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn
  }

  /**
   * Async getter for multiple items.
   * @returns Promise resolving to the items object or undefined.
   */
  const getValues = async (): Promise<ItemsType | undefined> => {
    try {
      return nls.getItems(key as Array<string>)
    } catch (err) {
      setError(err)
    }
  }

  return [nls, values, setValues, getValues, error, setError] as T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn
}
