import type { InstanceOptions, Credentials } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'

export const useNonLocalCounter = (id: string, key: string, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [nls, value, setValue] = useNonLocalStorage(id, key, options)

  // function to increment/decrement
  const increment = async (val?: number, opts?: any) => {
    const meta = await nls.incrementItem(key, val, opts)

    setValue({
      ...value,
      value: meta?.value,
      expiresAt: meta?.expiresAt ?? Date.now(), // fallback to current time or appropriate default
      keyVersion: meta?.keyVersion ?? 1,        // fallback to default version
      createdAt: meta?.createdAt ?? Date.now(), // fallback to current time
      updatedAt: meta?.updatedAt ?? Date.now()  // update timestamp
    })
  }

  const decrement = async (val?: number, opts?: any) => {
    const meta = await nls.decrementItem(key, val, opts)

    setValue({
      ...value,
      value: meta?.value,
      expiresAt: meta?.expiresAt ?? Date.now(), // fallback to current time or appropriate default
      keyVersion: meta?.keyVersion ?? 1,        // fallback to default version
      createdAt: meta?.createdAt ?? Date.now(), // fallback to current time
      updatedAt: meta?.updatedAt ?? Date.now()  // update timestamp
    })
  }

  return [value?.value, increment, decrement]
}
