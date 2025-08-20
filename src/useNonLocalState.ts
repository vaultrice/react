import type { InstanceOptions, ValueType, Credentials } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'

export const useNonLocalState = (id: string, key: string, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [nls, value, setValue] = useNonLocalStorage(id, key, options)

  // function to setItem
  const setItem = async (val: ValueType, opts?: any) => {
    const meta = await nls.setItem(key, val, opts)

    setValue({
      ...value,
      value: val,
      expiresAt: meta?.expiresAt ?? Date.now(), // fallback to current time or appropriate default
      keyVersion: meta?.keyVersion ?? 1,        // fallback to default version
      createdAt: meta?.createdAt ?? Date.now(), // fallback to current time
      updatedAt: meta?.updatedAt ?? Date.now()  // update timestamp
    })
  }

  return [value?.value, setItem]
}
