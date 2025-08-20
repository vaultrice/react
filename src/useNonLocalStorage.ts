import { useState, useEffect } from 'react'
import type { InstanceOptions, ItemType, Credentials } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'

async function getItem (nls: any, key: string, set: Function) {
  const res = await nls.getItem(key)
  if (set) set(res)
  return res
}

export const useNonLocalStorage = (id: string, key: string, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [keyValue, setKeyValue] = useState<ItemType | undefined>()

  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)
  const bind = options?.bind ?? true

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    getItem(nls, key, setKeyValue)

    const action = (item: ItemType) => {
      setKeyValue(item)
    }

    if (bind) nls.on('setItem', key, action)

    // unbind
    return () => {
      if (bind) nls.off('setItem', key, action)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const getKeyValue = async () => {
    return nls.getItem(key)
  }

  return [nls, keyValue, setKeyValue, getKeyValue]
}
