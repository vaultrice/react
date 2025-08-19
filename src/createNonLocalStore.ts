import type { InstanceOptions, ValueType } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { Credentials } from './types'

export const createNonLocalStore = (id: string, key: string, options: { instanceOptions: InstanceOptions, credentials?: Credentials }) => {
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  return {
    fetch: () => { return nls.getItem(key) },
    post: (value: ValueType) => { return nls.setItem(key, value) }
  }
}
