import { NonLocalStorage, createOfflineNonLocalStorage } from '@vaultrice/sdk'

import type { InstanceOptions, OfflineSyncOptions, Credentials } from '@vaultrice/sdk'

import { getCredentials /*, getDefaultOptions */ } from './config'

const Instances: any = {}

function buildKey (instanceOptions: InstanceOptions, credentials: Credentials) {
  const credentialsStr = `${credentials.projectId}-${credentials.apiKey}`
  const optionsStr = !instanceOptions.class ? `__undefined__-${instanceOptions.id}` : `${instanceOptions.class}-${instanceOptions.id}`

  return `${credentialsStr}-${optionsStr}`
}

export const getNonLocalStorage = (instanceOptions: InstanceOptions, credentials?: Credentials/*, options?: any */) => {
  const cred = credentials || getCredentials()
  // const opts = { ...getDefaultOptions(), ...options }

  const instanceKey = buildKey(instanceOptions, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const nls = new NonLocalStorage(cred, instanceOptions)
  Instances[instanceKey] = nls

  return nls
}

export const prepareOfflineNonLocalStorage = async (instanceOptions: OfflineSyncOptions, credentials?: Credentials) => {
  const cred = credentials || getCredentials()

  const instanceKey = buildKey(instanceOptions, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const onls = await createOfflineNonLocalStorage(cred, instanceOptions)
  Instances[instanceKey] = onls

  return onls
}
