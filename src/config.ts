import type { Credentials } from './types'

let Cred: Credentials
let Opts: any

export const init = (credentials: Credentials, defaultOptions: any) => {
  Cred = credentials
  Opts = defaultOptions
}

export const getCredentials = () => {
  return Cred
}

export const getDefaultOptions = () => {
  return Opts
}
