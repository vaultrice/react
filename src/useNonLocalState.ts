import type { ValueType } from '@vaultrice/sdk'

import { useNonLocalStorage } from './useNonLocalStorage'
import type { UseNonLocalStorageOptions } from './types'

export function useNonLocalState<VT extends ValueType> (id: string, key: string, options: UseNonLocalStorageOptions) {
  const [nls, value, setValue, error, setError] = useNonLocalStorage<VT>(id, key, options)

  // function to setItem
  const setItem = async (val: ValueType, opts?: any) => {
    try {
      const meta = await nls.setItem(key, val, opts)
      setValue(meta)
    } catch (err) {
      setError(err)
    }
  }

  return [value?.value as VT, setItem, error]
}
