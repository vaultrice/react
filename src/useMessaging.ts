import { useRef, useState, useEffect } from 'react'
import { NonLocalStorage } from '@vaultrice/sdk'
import type { InstanceOptions, JoinedConnections, JoinedConnection } from '@vaultrice/sdk'

import { getCredentials } from './config'
import type { Credentials } from './types'

export const useMessaging = (id: string, onMessage: Function, options: InstanceOptions = {}, credentials?: Credentials) => {
  const [connected, setConnected] = useState<JoinedConnections>([])
  const nls = useRef(new NonLocalStorage(credentials || getCredentials(), { ...options, id }))

  // some what a hack to not rerun useEffect if options are new but actually the same as previous
  const optionsJsonString = JSON.stringify(options)

  // update the nls instance when options change
  useEffect(() => {
    nls.current = new NonLocalStorage(credentials || getCredentials(), { ...options, id })

    const getConnections = async () => {
      const con = await nls.current?.getJoinedConnections()
      setConnected(con)
    }

    getConnections()
  }, [id, optionsJsonString])

  // bind to get item changes
  useEffect(() => {
    if (!nls.current) return

    const joinAction = (joined: JoinedConnection) => {
      setConnected([joined].concat(connected ?? []))
    }

    const leaveAction = (left: JoinedConnection) => {
      setConnected((connected ?? []).filter(c => c.connectionId !== left.connectionId))
    }

    nls.current.on('message', onMessage)
    nls.current.on('presence:join', joinAction)
    nls.current.on('presence:leave', leaveAction)

    // unbind
    return () => {
      nls.current.off('message', onMessage)
      nls.current.off('presence:join', joinAction)
      nls.current.off('presence:leave', leaveAction)
    }
  }, [])

  return [connected, (msg) => { nls.current?.send(msg), onMessage(msg) }, (user: any) => { nls.current?.join(user) }, () => { nls.current?.leave }]
}
