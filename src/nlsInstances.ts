import { NonLocalStorage } from '@vaultrice/sdk'

import type { InstanceOptions } from '@vaultrice/sdk'
import type { Credentials } from './types'

import { getCredentials } from './config'

const Instances: any = {}

function buildKey (options: InstanceOptions, credentials: Credentials) {
  const credentialsStr = `${credentials.projectId}-${credentials.apiKey}`
  const optionsStr = !options.class ? `__undefined__-${options.id}` : `${options.class}-${options.id}`

  return `${credentialsStr}-${optionsStr}`
}

export const getNonLocalStorage = (options: InstanceOptions, credentials?: Credentials) => {
  const cred = credentials || getCredentials()

  const instanceKey = buildKey(options, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const nls = new NonLocalStorage(cred, options)
  Instances[instanceKey] = nls

  return nls
}
