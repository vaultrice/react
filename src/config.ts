import type { Credentials } from '@vaultrice/sdk'

let Cred: Credentials
let Opts: any

/**
 * Initializes global credentials and default options for NonLocalStorage usage.
 * Should be called once before using other config functions.
 *
 * @param credentials - The credentials object for Vaultrice SDK.
 * @param defaultOptions - Default options to use for NonLocalStorage instances.
 */
export const init = (credentials: Credentials, defaultOptions: any) => {
  Cred = credentials
  Opts = defaultOptions
}

/**
 * Retrieves the globally stored credentials.
 *
 * @returns The credentials object.
 */
export const getCredentials = () => {
  return Cred
}

/**
 * Retrieves the globally stored default options.
 *
 * @returns The default options object.
 */
export const getDefaultOptions = () => {
  return Opts
}
