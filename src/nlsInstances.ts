import { NonLocalStorage } from '@vaultrice/sdk'

import type { InstanceOptions } from '@vaultrice/sdk'
import type { Credentials } from './types'

import { getCredentials, getDefaultOptions } from './config'

const Instances: any = {}

function buildKey (instanceOptions: InstanceOptions, credentials: Credentials) {
  const credentialsStr = `${credentials.projectId}-${credentials.apiKey}`
  const optionsStr = !instanceOptions.class ? `__undefined__-${instanceOptions.id}` : `${instanceOptions.class}-${instanceOptions.id}`

  return `${credentialsStr}-${optionsStr}`
}

export const getNonLocalStorage = (instanceOptions: InstanceOptions, credentials?: Credentials, options?: any) => {
  const cred = credentials || getCredentials()
  const opts = { ...getDefaultOptions(), ...options }

  const instanceKey = buildKey(instanceOptions, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const nls = new NonLocalStorage(cred, instanceOptions)
  Instances[instanceKey] = nls

  if (opts?.fetchAccessToken) {
    nls.onAccessTokenExpiring(async () => {
      const token = await opts.fetchAccessToken()
      nls.useAccessToken(token)
    })
  }

  return nls
}
