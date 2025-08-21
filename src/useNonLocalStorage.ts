import { useState, useEffect } from 'react'
import type { InstanceOptions, ItemType, ItemsType, Credentials } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'

async function getItem (nls: any, key: string | Array<string>, set: Function) {
  let res

  if (typeof key === 'string') {
    res = await nls.getItem(key)
    if (set) set({ [`${key}`]: res })
  } else {
    res = await nls.getItems(key)
    if (set) set(res)
  }

  return res
}

export const useNonLocalStorage = (id: string, key: string | Array<string>, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [values, setValues] = useState<ItemsType | undefined>()

  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)
  const bind = options?.bind ?? true

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    getItem(nls, key, setValues)

    const getHandler = (key: string) => {
      return function handler (item: ItemType) {
        setValues({
          ...values,
          [`${key}`]: item
        })
      }
    }

    // we need to keep the handler functions to unbind
    const handlers: { [key: string]: Function } = {}

    if (bind) {
      const keys = typeof key === 'string' ? [key] : key

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
    const getValue = async () => {
      return nls.getItem(key)[key]
    }

    const setValue = (val: any) => {
      setValues({
        ...values,
        [`${key}`]: val
      })
    }

    return [nls, values ? values[key] : undefined, setValue, getValue]
  }

  const getValues = async () => {
    return nls.getItem(key)
  }

  return [nls, values, setValues, getValues]
}
