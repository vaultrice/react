import React, { useState } from 'react'
import { useMultiNonLocalStates } from '..'

export interface UseMultiNonLocalStatesTestProps {
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
export const UseMultiNonLocalStatesTest = ({}: UseMultiNonLocalStatesTestProps) => {
  const [inputValue, setInput] = useState()

  const [values, setValues] = useMultiNonLocalStates('useMultiNonLocalState_test', ['test_key1', 'test_key2', 'test_key3'], {
    credentials: {
      projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
      apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
      apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
    }
  })

  return (
    <>
      <div>
        <h5>current value:</h5>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <div>
        <input onChange={(e) => { setInput(e.target.value) }} />
        <button
          type='button'
          className='storybook-button'
          onClick={() => { setValues({ test_key1: { value: inputValue } }) }}
        >
          set 1
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { setValues({ test_key2: { value: inputValue } }) }}
        >
          set 2
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { setValues({ test_key3: { value: inputValue } }) }}
        >
          set 3
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { setValues({ test_key1: { value: inputValue }, test_key2: { value: inputValue }, test_key3: { value: inputValue } }) }}
        >
          set all
        </button>
      </div>
    </>
  )
}
