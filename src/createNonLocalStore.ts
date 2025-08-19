import type { InstanceOptions, ValueType } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { Credentials } from './types'

export const createNonLocalStore = (id: string, key: string, options: InstanceOptions = {}, credentials?: Credentials) => {
  const nls = getNonLocalStorage({ ...options, id }, credentials)

  return {
    fetch: () => { return nls.getItem(key) },
    post: (value: ValueType) => { return nls.setItem(key, value) }
  }
}
