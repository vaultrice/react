import type { InstanceOptions, ValueType, Credentials } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'

export const useMultiNonLocalStates = (id: string, keys: Array<string>, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [nls, values, setValues] = useNonLocalStorage(id, keys, options)

  // function to setItem
  const setItems = async (items: Record<string, { value: ValueType, ttl?: number, ifAbsent?: boolean }>) => {
    console.warn(items)
    const res = await nls.setItems(items)

    console.warn(items, values, res)

    setValues({
      ...values,
      ...res
    })
  }

  return [values, setItems]
}
