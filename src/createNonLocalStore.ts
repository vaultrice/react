import { NonLocalStorage } from '@vaultrice/sdk'
import type { InstanceOptions, ValueType } from '@vaultrice/sdk'

import { getCredentials } from './config'
import type { Credentials } from './types'

export const createNonLocalStore = (id: string, key: string, options: InstanceOptions = {}, credentials?: Credentials) => {
  const nls = new NonLocalStorage(credentials || getCredentials(), { ...options, id })

  return {
    fetch: () => { return nls.getItem(key) },
    post: (value: ValueType) => { return nls.setItem(key, value) }
  }
}
