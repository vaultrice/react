import React from 'react'
import type { InstanceOptions, Credentials, ItemsType, ItemType, NonLocalStorage, JoinedConnections, JSONObj, ValueType } from '@vaultrice/sdk'

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

export type UseMessagingOptions = {
  /**
   * Custom deduplication strategy for presence connections.
   * If not provided, defaults to connectionId deduplication.
   * Can be a string (single property) or array of strings (multiple properties).
   */
  deduplicateBy?: string | string[]
} & UseGeneralOptions

/**
 * Return type for useMessaging hook
 */
export type UseMessagingReturn = [
  /** Array of currently connected users */
  JoinedConnections,
  /** Function to send a message */
  // eslint-disable-next-line no-unused-vars
  (msg: JSONObj) => void,
  /** Function to join presence with a user object */
  // eslint-disable-next-line no-unused-vars
  (user: any) => void,
  /** Function to leave presence */
  () => void,
  /** Current connection ID */
  string | undefined,
  /** Error state for messaging and presence operations */
  any
]

/**
 * Return type for useNonLocalState hook.
 * @template VT - Value type
 */
export type UseNonLocalStateReturn<VT extends ValueType> = [
  /** The current value for the specified key */
  VT,
  /** Function to set the value for the key */
  // eslint-disable-next-line no-unused-vars
  (val: VT, opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => Promise<void>,
  /** Error state */
  any,
  /** Loading state */
  boolean
]

/**
 * Return type for useNonLocalGeneralState hook.
 * @template VT - Value type
 */
export type UseNonLocalGeneralStateReturn<VT extends ValueType> = [
  /** The current value for the specified key */
  VT,
  /** Actions object with various atomic operations */
  {
    /** Function to set the value for the key */
    // eslint-disable-next-line no-unused-vars
    setItem: (val: VT, opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => Promise<void>,
    /** Function to append an element to an array */
    // eslint-disable-next-line no-unused-vars
    push: (element: ValueType, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to perform a shallow merge into an object */
    // eslint-disable-next-line no-unused-vars
    merge: (objectToMerge: Record<string, ValueType>, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to set a nested value using dot notation */
    // eslint-disable-next-line no-unused-vars
    setIn: (path: string, val: ValueType, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to splice an array */
    // eslint-disable-next-line no-unused-vars
    splice: (startIndex: number, deleteCount: number, items?: ValueType[], opts?: { ttl?: number, updatedAt?: number }) => Promise<void>
  },
  /** Error state */
  any,
  /** Loading state */
  boolean
]

/**
 * Return type for useNonLocalCounter hook.
 */
export type UseNonLocalCounterReturn = [
  /** The current counter value */
  number | undefined,
  /** Function to increment the counter */
  // eslint-disable-next-line no-unused-vars
  (val?: number, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
  /** Function to decrement the counter */
  // eslint-disable-next-line no-unused-vars
  (val?: number, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
  /** Error state */
  any,
  /** Loading state */
  boolean
]

/**
 * Return type for useNonLocalObject hook.
 * @template T - The shape of the stored object
 */
export type UseNonLocalObjectReturn<T extends Record<string, ValueType> = Record<string, ValueType>> = [
  /** The current object value */
  T,
  /** Actions object with object-specific operations */
  {
    /** Function to perform a shallow merge into the object */
    // eslint-disable-next-line no-unused-vars
    merge: (objectToMerge: Partial<T>, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to set a nested value using dot notation */
    // eslint-disable-next-line no-unused-vars
    setIn: (path: string, val: ValueType, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to replace the whole object */
    // eslint-disable-next-line no-unused-vars
    setObject: (obj: T, opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => Promise<void>
  },
  /** Error state */
  any,
  /** Loading state */
  boolean
]

/**
 * Return type for useNonLocalArray hook.
 * @template T - The element type stored in the array
 */
export type UseNonLocalArrayReturn<T extends ValueType> = [
  /** The current array value */
  T[],
  /** Actions object with array-specific operations */
  {
    /** Function to append an element to the array */
    // eslint-disable-next-line no-unused-vars
    push: (element: T, opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to splice the array */
    // eslint-disable-next-line no-unused-vars
    splice: (startIndex: number, deleteCount: number, items?: T[], opts?: { ttl?: number, updatedAt?: number }) => Promise<void>,
    /** Function to replace the whole array */
    // eslint-disable-next-line no-unused-vars
    setArray: (arr: T[], opts?: { ttl?: number, ifAbsent?: boolean, updatedAt?: number }) => Promise<void>
  },
  /** Error state */
  any,
  /** Loading state */
  boolean
]
