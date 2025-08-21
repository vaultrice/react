import { useState, useEffect } from 'react'
import type { JoinedConnections, JoinedConnection, LeavedConnection, JSONObj } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { UseGeneralOptions } from './types'

/**
 * React hook for managing real-time messaging and presence using NonLocalStorage.
 *
 * Handles connection state, message sending, joining/leaving presence, and error reporting.
 * Automatically subscribes to presence and message events, and updates the connected users list.
 *
 * @param id - The unique identifier for the NonLocalStorage instance.
 * @param onMessage - Callback invoked when a message is received.
 * @param options - General options including credentials and instance options.
 * @returns A tuple containing:
 * - connected: Array of currently connected users.
 * - send: Function to send a message.
 * - join: Function to join presence with a user object.
 * - leave: Function to leave presence.
 * - error: Any error encountered during messaging or presence operations.
 */
export const useMessaging = (
  id: string,
  // eslint-disable-next-line no-unused-vars
  onMessage: (msg: JSONObj) => void,
  options: UseGeneralOptions
) => {
  const [connected, setConnected] = useState<JoinedConnections>([])
  const [error, setError] = useState<any>()
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  // bind to get item changes
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

    // bind events
    const joinAction = (joined: JoinedConnection) => {
      if (!connected.find(c => c.connectionId === joined.connectionId)) setConnected([joined].concat(connected ?? []))
    }

    const leaveAction = (left: LeavedConnection) => {
      setConnected((connected ?? []).filter(c => c.connectionId !== left.connectionId))
    }

    nls.on('message', onMessage)
    nls.on('presence:join', joinAction)
    nls.on('presence:leave', leaveAction)

    // unbind
    return () => {
      nls.off('message', onMessage)
      nls.off('presence:join', joinAction)
      nls.off('presence:leave', leaveAction)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected])

  return [
    connected,
    /**
     * Sends a message to other connected clients.
     * @param msg - The message object to send.
     */
    (msg: any) => {
      try {
        nls?.send(msg)
        onMessage(msg)
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
     * Error state for messaging and presence operations.
     */
    error
  ]
}
