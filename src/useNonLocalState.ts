import { useState, useEffect } from 'react'
import type { InstanceOptions, ItemType, ValueType } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { Credentials } from './types'

async function getItem (nls: any, key: string, set: Function) {
  const res = await nls.getItem(key)
  if (set) set(res)
  return res
}

export const useNonLocalState = (id: string, key: string, options: InstanceOptions = {}, credentials?: Credentials) => {
  const [keyValue, setKeyValue] = useState<ItemType | undefined>()

  const nls = getNonLocalStorage({ ...options, id }, credentials)

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    getItem(nls, key, setKeyValue)

    const action = (item: ItemType) => {
      setKeyValue(item)
    }

    nls.on('setItem', key, action)

    // unbind
    return () => {
      nls.off('setItem', key, action)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // function to setItem
  const setItem = async (value: ValueType) => {
    const meta = await nls.setItem(key, value)

    setKeyValue({
      ...keyValue,
      value,
      expiresAt: meta?.expiresAt ?? Date.now(), // fallback to current time or appropriate default
      keyVersion: meta?.keyVersion ?? 1,        // fallback to default version
      createdAt: meta?.createdAt ?? Date.now(), // fallback to current time
      updatedAt: meta?.updatedAt ?? Date.now()  // update timestamp
    })
  }

  return [keyValue?.value, setItem]
}
