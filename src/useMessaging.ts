import { useState, useEffect } from 'react'
import type { InstanceOptions, JoinedConnections, JoinedConnection } from '@vaultrice/sdk'

import { getNonLocalStorage } from './nlsInstances'
import type { Credentials } from './types'

export const useMessaging = (id: string, onMessage: Function, options: InstanceOptions = {}, credentials?: Credentials) => {
  const [connected, setConnected] = useState<JoinedConnections>([])
  const nls = getNonLocalStorage({ ...options, id }, credentials)

  // bind to get item changes
  useEffect(() => {
    if (!nls) return

    // get initial connections
    const getConnections = async () => {
      const con = await nls.current?.getJoinedConnections()
      setConnected(con || [])
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

  return [connected, (msg) => { nls?.send(msg), onMessage(msg) }, (user: any) => { nls?.join(user) }, () => { nls?.leave }]
}
