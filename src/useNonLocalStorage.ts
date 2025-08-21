import { useState, useEffect } from 'react'
import type { ItemType, ItemsType, NonLocalStorage, ValueType } from '@vaultrice/sdk'
import type { UseNonLocalStorageOptions, UseNonLocalStorageStringReturn, UseNonLocalStorageArrayReturn } from './types'

import { getNonLocalStorage } from './nlsInstances'

async function getItem<VT> (nls: NonLocalStorage, key: string | Array<string>, set: Function) {
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

export function useNonLocalStorage<VT extends ValueType, T extends string | Array<string> = string> (
  id: string,
  key: T,
  options: UseNonLocalStorageOptions
): T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn {
  const [values, setValues] = useState<ItemsType | undefined>()
  const [error, setError] = useState<any>()

  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)
  const bind = options?.bind ?? true

  // bind to get item changes
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
    const getValue = async (): Promise<ItemType | undefined> => {
      try {
        const result = await nls.getItem(key)
        return result
      } catch (err) {
        setError(err)
      }
    }

    const setValue = (val: ItemType | undefined) => {
      if (!val) return
      setValues(prevValues => ({
        ...prevValues,
        [`${key}`]: val
      }))
    }

    return [nls, values ? values[key] : undefined, setValue, getValue, error, setError] as T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn
  }

  const getValues = async (): Promise<ItemsType | undefined> => {
    try {
      return nls.getItems(key as Array<string>)
    } catch (err) {
      setError(err)
    }
  }

  return [nls, values, setValues, getValues, error, setError] as T extends string ? UseNonLocalStorageStringReturn : UseNonLocalStorageArrayReturn
}
