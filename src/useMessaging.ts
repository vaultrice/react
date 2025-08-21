import { useState, useEffect } from 'react'
import type { InstanceOptions, JoinedConnections, JoinedConnection, Credentials } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'

export const useMessaging = (id: string, onMessage: Function, options: { instanceOptions: InstanceOptions, credentials?: Credentials }) => {
  const [connected, setConnected] = useState<JoinedConnections>([])
  const [error, setError] = useState<any>()
  const nls = getNonLocalStorage({ ...options?.instanceOptions, id }, options?.credentials)

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    // get initial connections
    const getConnections = async () => {
      try {
        const con = await nls.current?.getJoinedConnections()
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

    const leaveAction = (left: JoinedConnection) => {
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
