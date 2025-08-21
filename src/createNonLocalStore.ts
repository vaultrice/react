import type { ItemType, ValueType } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { UseGeneralOptions } from './types'

export const createNonLocalStore = (id: string, key: string, options: UseGeneralOptions) => {
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  return {
    fetch: (): Promise<ItemType | undefined> => { return nls.getItem(key) },
    post: (value: ValueType): Promise<ItemType | undefined> => { return nls.setItem(key, value) }
  }
}
