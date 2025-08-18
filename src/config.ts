import type { Credentials } from './types'

let Cred: Credentials

export const init = (credentials: Credentials) => {
  Cred = credentials
}

export const getCredentials = () => {
  return Cred;
}