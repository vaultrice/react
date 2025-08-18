import React, { useState } from 'react'
import { useNonLocalState } from '..'

export interface UseNonLocalStateTestProps {
  // /** Is this the principal call to action on the page? */
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
export const UseNonLocalStateTest = ({}: UseNonLocalStateTestProps) => {
  const [inputValue, setInput] = useState()

  const [value, setValue] = useNonLocalState('useNonLocalState_test', 'test_key', {}, {
    projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
    apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
    apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
  })

  return (
    <>
      <div>
        <h5>current value:</h5>
        <p>{value}</p>
      </div>
      <div>
        <input onChange={(e) => { setInput(e.target.value) }} />
        <button
          type='button'
          className='storybook-button'
          onClick={() => { setValue(inputValue) }}
        >
          set
        </button>
      </div>
    </>
  )
}
