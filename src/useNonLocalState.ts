import { useRef, useState, useEffect } from 'react'
import { NonLocalStorage } from '@vaultrice/sdk'
import type { InstanceOptions, ItemType, ValueType } from '@vaultrice/sdk'

import { getCredentials } from './config'
import type { Credentials } from './types'

async function getItem (nls: any, key: string, set: Function) {
  const res = await nls.getItem(key)
  if (set) set(res)
  return res
}

export const useNonLocalState = (id: string, key: string, options: InstanceOptions = {}, credentials?: Credentials) => {
  const [keyValue, setKeyValue] = useState<ItemType | undefined>()
  const nls = useRef(new NonLocalStorage(credentials || getCredentials(), { ...options, id }))

  // some what a hack to not rerun useEffect if options are new but actually the same as previous
  const optionsJsonString = JSON.stringify(options)

  // update the nls instance when options change
  useEffect(() => {
    nls.current = new NonLocalStorage(credentials || getCredentials(), { ...options, id })

    getItem(nls.current, key, setKeyValue)
  }, [id, optionsJsonString])

  // bind to get item changes
  useEffect(() => {
    if (!nls.current) return

    const action = (item: ItemType) => {
      setKeyValue(item)
    }

    nls.current.on('setItem', key, action)

    // unbind
    return () => {
      nls.current.off('setItem', key, action)
    }
  }, [key])

  // function to setItem
  const setItem = async (value: ValueType) => {
    await nls.current.setItem(key, value)
    if (keyValue) {
      setKeyValue({
        ...keyValue,
        value,
        expiresAt: keyValue.expiresAt ?? Date.now(), // fallback to current time or appropriate default
        keyVersion: keyValue.keyVersion ?? 1,        // fallback to default version
        createdAt: keyValue.createdAt ?? Date.now(), // fallback to current time
        updatedAt: Date.now()                        // update timestamp
      })
    }
  }

  return [keyValue?.value, setItem]
}
