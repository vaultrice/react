import { useState, useEffect } from 'react'
import type { JoinedConnections, JoinedConnection, LeavedConnection, JSONObj } from '@vaultrice/sdk'
import { getNonLocalStorage } from './nlsInstances'
import type { UseMessagingOptions, UseMessagingReturn } from './types'

/**
 * Helper function to create a unique key for deduplication based on connection data
 */
const createDeduplicationKey = (connection: JoinedConnection, deduplicateBy?: string | string[]): string => {
  // Always start with connectionId as base deduplication
  let keyParts = [`connectionId:${connection.connectionId}`]

  // If no data, only use connectionId
  if (!connection.data) {
    return keyParts.join('|')
  }

  // If no custom deduplication strategy is provided, use all properties in data
  if (!deduplicateBy) {
    const allProps = Object.keys(connection.data).sort() // sort for consistent key order
    const dataParts = allProps.map(prop => {
      const value = connection.data?.[prop]
      return `${prop}:${JSON.stringify(value)}`
    })
    keyParts = keyParts.concat(dataParts)
  } else {
    // Use custom deduplication strategy in addition to connectionId
    const props = Array.isArray(deduplicateBy) ? deduplicateBy : [deduplicateBy]

    // Create additional key parts from specified properties
    const dataParts = props.map(prop => {
      const value = connection.data?.[prop]
      return value !== undefined ? `${prop}:${JSON.stringify(value)}` : `${prop}:undefined`
    })
    keyParts = keyParts.concat(dataParts)
  }

  return keyParts.join('|')
}

/**
 * React hook for managing real-time messaging and presence using NonLocalStorage.
 *
 * Handles connection state, message sending, joining/leaving presence, and error reporting.
 * Automatically subscribes to presence and message events, and updates the connected users list.
 *
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param onMessageOrOptions - Either a callback for messages or options object.
 * @param options - General options (only when second param is onMessage).
 * @returns A tuple containing:
 * - connected: Array of currently connected users.
 * - send: Function to send a message.
 * - join: Function to join presence with a user object.
 * - leave: Function to leave presence.
 * - error: Any error encountered during messaging or presence operations.
 */
export function useMessaging (
  // eslint-disable-next-line no-unused-vars
  id: string,
  // eslint-disable-next-line no-unused-vars
  onMessageOrOptions: ((msg: JSONObj) => void) | UseMessagingOptions | undefined,
  // eslint-disable-next-line no-unused-vars
  options?: UseMessagingOptions
): UseMessagingReturn
// eslint-disable-next-line no-redeclare
export function useMessaging (
  // eslint-disable-next-line no-unused-vars
  id: string,
  // eslint-disable-next-line no-unused-vars
  options: UseMessagingOptions
): UseMessagingReturn
// eslint-disable-next-line no-redeclare
export function useMessaging (
  id: string,
  // eslint-disable-next-line no-unused-vars
  onMessageOrOptions: ((msg: JSONObj) => void) | UseMessagingOptions | undefined,
  options?: UseMessagingOptions
): UseMessagingReturn {
  // Determine if second parameter is onMessage callback or options
  const isOnMessageCallback = typeof onMessageOrOptions === 'function' || onMessageOrOptions === undefined
  // eslint-disable-next-line no-unused-vars
  const onMessage = isOnMessageCallback && typeof onMessageOrOptions === 'function' ? onMessageOrOptions as (msg: JSONObj) => void : undefined
  const finalOptions = isOnMessageCallback ? options! : onMessageOrOptions as UseMessagingOptions

  const [connected, setConnected] = useState<JoinedConnections>([])
  const [connectionId, setConnectionId] = useState<string | undefined>()
  const [error, setError] = useState<any>()
  const nls = getNonLocalStorage({ ...finalOptions?.instanceOptions, id }, finalOptions?.credentials)

  // load initial connections and connection ID
  useEffect(() => {
    if (!nls) return

    // get initial connections
    const getConnections = async () => {
      try {
        const con = await nls.getJoinedConnections()
        setConnected(con || [])
      } catch (err) {
        setError(err)
      }
    }

    getConnections()
    // re-run if nls instance changes
  }, [nls])

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    const joinAction = (joined: JoinedConnection) => {
      setConnected(prev => {
        const deduplicationKey = createDeduplicationKey(joined, finalOptions?.deduplicateBy)

        // Remove any existing connections with the same deduplication key
        const others = (prev ?? []).filter(c => {
          const existingKey = createDeduplicationKey(c, finalOptions?.deduplicateBy)
          return existingKey !== deduplicationKey
        })

        // Check if this is the current user's connection and put it first
        const isMyConnection = joined.connectionId === nls.connectionId
        return isMyConnection ? [joined, ...others] : [...others, joined]
      })
    }

    const leaveAction = (left: LeavedConnection) => {
      setConnected(prev => {
        // For leave actions, we need to handle deduplication differently
        // Remove all connections that match the leaving connection's deduplication key
        if (finalOptions?.deduplicateBy || (left.data && Object.keys(left.data).length > 0)) {
          // Create a temporary JoinedConnection-like object for deduplication key generation
          const tempConnection: JoinedConnection = {
            connectionId: left.connectionId,
            data: left.data,
            joinedAt: 0 // Not used for deduplication
          }
          const leftDeduplicationKey = createDeduplicationKey(tempConnection, finalOptions?.deduplicateBy)

          return (prev ?? []).filter(c => {
            const existingKey = createDeduplicationKey(c, finalOptions?.deduplicateBy)
            return existingKey !== leftDeduplicationKey
          })
        } else {
          // Fallback to connectionId-based removal
          return (prev ?? []).filter(c => c.connectionId !== left.connectionId)
        }
      })
    }

    const onConnect = () => {
      setConnectionId(nls.connectionId)
    }

    nls.on('connect', onConnect) // needs to be subscribed before the others
    if (onMessage) nls.on('message', onMessage)
    nls.on('presence:join', joinAction)
    nls.on('presence:leave', leaveAction)

    if (nls.connectionId) setConnectionId(nls.connectionId)

    // unbind
    return () => {
      if (!nls) return
      if (onMessage) nls.off('message', onMessage)
      nls.off('presence:join', joinAction)
      nls.off('presence:leave', leaveAction)
      nls.off('connect', onConnect)
    }
    // depend on nls, onMessage, and deduplication strategy
  }, [nls, onMessage, finalOptions?.deduplicateBy])

  return [
    connected,
    /**
     * Sends a message to other connected clients.
     * @param msg - The message object to send.
     */
    (msg: any) => {
      try {
        nls?.send(msg)
        if (onMessage) onMessage(msg)
      } catch (err) {
        setError(err)
      }
    },
    /**
     * Joins presence with the given user object.
     * @param user - The user object to join as.
     */
    (user: any) => {
      try {
        nls?.join(user)
      } catch (err) {
        setError(err)
      }
    },
    /**
     * Leaves presence for the current user.
     */
    () => {
      try {
        nls?.leave()
      } catch (err) {
        setError(err)
      }
    },
    /**
     * Current connection ID.
     */
    connectionId,
    /**
     * Error state for messaging and presence operations.
     */
    error
  ]
}
