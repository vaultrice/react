import type { InstanceOptions, ValueType, Credentials } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'

export const createNonLocalStore = (id: string, key: string, options: { instanceOptions: InstanceOptions, credentials?: Credentials, fetchAccessToken: Function }) => {
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  return {
    fetch: () => { return nls.getItem(key) },
    post: (value: ValueType) => { return nls.setItem(key, value) }
  }
}
