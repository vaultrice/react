import React, { useState } from 'react'
import { useMessaging } from '..'

export interface UseMessagingTestProps {
  // /** Is this the principal call tTo action on the page? */
  // primary?: boolean;
  // /** What background color to use */
  // backgroundColor?: string;
  // /** How large should the button be? */
  // size?: 'small' | 'medium' | 'large';
  // /** Button contents */
  // label: string;
  // /** Optional click handler */
  // onClick?: () => void;
}

/** Primary UI component for user interaction */
export const UseMessagingTest = ({}: UseMessagingTestProps) => {
  const [inputValue, setInput] = useState()
  const [msgValue, setMsg] = useState()
  const [lastMsgValue, setLastMsg] = useState()

  const [connected, send, join, leave] = useMessaging('useMessaging_test', (msg) => {
    setLastMsg(msg.myMsg)
  }, {}, {
    projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
    apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
    apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
  })

  return (
    <>
      <div>
        <h5>current connected:</h5>
        <div>{connected.map(u => (<p key={u.connectionId}>{u.data?.name}</p>))}</div>
      </div>
      <div>
        <h5>message:</h5>
        <p>{lastMsgValue || 'nothing received'}</p>
        <input onChange={(e) => { setMsg(e.target.value) }} />
        <button
          type='button'
          className='storybook-button'
          onClick={() => { send({ myMsg: msgValue }) }}
        >
          send
        </button>
      </div>
      <div>
        <input onChange={(e) => { setInput(e.target.value) }} />
        <button
          type='button'
          className='storybook-button'
          onClick={() => { join({ name: inputValue }) }}
        >
          join
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { leave({ name: inputValue }) }}
        >
          leave
        </button>
      </div>
    </>
  )
}
