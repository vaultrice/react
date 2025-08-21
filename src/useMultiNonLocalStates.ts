import type { ValueType } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

export const useMultiNonLocalStates = (id: string, keys: Array<string>, options: UseNonLocalStorageOptions) => {
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
