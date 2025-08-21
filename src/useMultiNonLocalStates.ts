import type { InstanceOptions, ValueType, Credentials } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'

export const useMultiNonLocalStates = (id: string, keys: Array<string>, options: { bind: true, instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const [nls, values, setValues,, error, setError] = useNonLocalStorage(id, keys, options)

  // function to setItem
  const setItems = async (items: Record<string, { value: ValueType, ttl?: number, ifAbsent?: boolean }>) => {
    try {
      const res = await nls.setItems(items)

      setValues({
        ...values,
        ...res
      })
    } catch (err) {
      setError(err)
    }
  }

  return [values, setItems, error]
}
