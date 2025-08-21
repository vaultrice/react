import React from 'react'
import type { InstanceOptions, Credentials, ItemsType, ItemType, NonLocalStorage } from '@vaultrice/sdk'

export type UseNonLocalStorageOptions = {
  bind?: boolean,
  instanceOptions?: InstanceOptions,
  credentials?: Credentials
}

// For single key (string)
export type UseNonLocalStorageStringReturn = [
  NonLocalStorage,
  ItemType | undefined,
  // eslint-disable-next-line no-unused-vars
  (val: ItemType | undefined) => void,  // Custom setter function
  () => Promise<ItemType>,
  any,
  React.Dispatch<React.SetStateAction<any>>
]

// For multiple keys (array)
export type UseNonLocalStorageArrayReturn = [
  NonLocalStorage,
  ItemsType | undefined,
  React.Dispatch<React.SetStateAction<ItemsType | undefined>>,
  () => Promise<ItemsType>,
  any,
  React.Dispatch<React.SetStateAction<any>>
]
