import { useState, useEffect } from 'react'
import type { JoinedConnections, JoinedConnection, LeavedConnection, JSONObj } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { UseGeneralOptions } from './types'

// eslint-disable-next-line no-unused-vars
export const useMessaging = (id: string, onMessage: (msg: JSONObj) => void, options: UseGeneralOptions) => {
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
      setConnected([joined].concat(connected ?? []))
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
  }, [])

  return [
    connected,
    (msg: any) => {
      try {
        nls?.send(msg)
        onMessage(msg)
      } catch (err) {
        setError(err)
      }
    },
    (user: any) => {
      try {
        nls?.join(user)
      } catch (err) {
        setError(err)
      }
    },
    () => {
      try {
        nls?.leave()
      } catch (err) {
        setError(err)
      }
    },
    error
  ]
}
