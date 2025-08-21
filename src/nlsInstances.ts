import { NonLocalStorage, createOfflineNonLocalStorage } from '@vaultrice/sdk'
import type { InstanceOptions, OfflineSyncOptions, Credentials } from '@vaultrice/sdk'
import { getCredentials /*, getDefaultOptions */ } from './config'

const Instances: any = {}

/**
 * Builds a unique key for identifying NonLocalStorage instances based on instance options and credentials.
 *
 * @param instanceOptions - Options for the NonLocalStorage instance.
 * @param credentials - Credentials for authentication.
 * @returns A string key representing the instance.
 */
function buildKey (instanceOptions: InstanceOptions, credentials: Credentials): string {
  const credentialsStr = `${credentials.projectId}-${credentials.apiKey}`
  const optionsStr = !instanceOptions.class ? `__undefined__-${instanceOptions.id}` : `${instanceOptions.class}-${instanceOptions.id}`
  return `${credentialsStr}-${optionsStr}`
}

/**
 * Retrieves a cached NonLocalStorage instance or creates a new one if not present.
 *
 * @param instanceOptions - Options for the NonLocalStorage instance.
 * @param credentials - Optional credentials for authentication. If not provided, uses global credentials.
 * @returns The NonLocalStorage instance.
 */
export const getNonLocalStorage = (instanceOptions: InstanceOptions, credentials?: Credentials): NonLocalStorage => {
  const cred = credentials || getCredentials()
  const instanceKey = buildKey(instanceOptions, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const nls = new NonLocalStorage(cred, instanceOptions) // TODO: May throw
  Instances[instanceKey] = nls

  return nls
}

/**
 * Prepares and caches an offline-enabled NonLocalStorage instance.
 *
 * @param instanceOptions - Options for offline sync.
 * @param credentials - Optional credentials for authentication. If not provided, uses global credentials.
 * @returns A promise resolving to the offline-enabled NonLocalStorage instance.
 */
export const prepareOfflineNonLocalStorage = async (instanceOptions: OfflineSyncOptions, credentials?: Credentials): Promise<NonLocalStorage> => {
  const cred = credentials || getCredentials()
  const instanceKey = buildKey(instanceOptions, cred)

  if (Instances[instanceKey]) return Instances[instanceKey]

  const onls = await createOfflineNonLocalStorage(cred, instanceOptions)
  Instances[instanceKey] = onls

  return onls
}
