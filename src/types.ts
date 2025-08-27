import React from 'react'
import type { InstanceOptions, Credentials, ItemsType, ItemType, NonLocalStorage } from '@vaultrice/sdk'

/**
 * General options for NonLocalStorage hooks.
 */
export type UseGeneralOptions = {
  /** Options for the NonLocalStorage instance */
  instanceOptions?: InstanceOptions,
  /** Credentials for authentication */
  credentials?: Credentials
}

/**
 * Options for useNonLocalStorage hooks.
 */
export type UseNonLocalStorageOptions = {
  /** Whether to bind to changes (default: true) */
  bind?: boolean
} & UseGeneralOptions

/**
 * Return type for useNonLocalStorage when using a single key (string).
 * @template VT - Value type
 */
export type UseNonLocalStorageStringReturn = [
  /** NonLocalStorage instance */
  NonLocalStorage,
  /** The item value for the key */
  ItemType | undefined,
  /** Setter function for the item */
  // eslint-disable-next-line no-unused-vars
  (val: ItemType | undefined) => void,
  /** Async getter for the item */
  () => Promise<ItemType>,
  /** Error state */
  any,
  /** Error setter */
  React.Dispatch<React.SetStateAction<any>>,
  /** isLoading */
  boolean
]

/**
 * Return type for useNonLocalStorage when using multiple keys (array).
 * @template VT - Value type
 */
export type UseNonLocalStorageArrayReturn = [
  /** NonLocalStorage instance */
  NonLocalStorage,
  /** The items for the keys */
  ItemsType | undefined,
  /** Setter function for the items */
  React.Dispatch<React.SetStateAction<ItemsType | undefined>>,
  /** Async getter for the items */
  () => Promise<ItemsType>,
  /** Error state */
  any,
  /** Error setter */
  React.Dispatch<React.SetStateAction<any>>,
  /** isLoading */
  boolean
]
