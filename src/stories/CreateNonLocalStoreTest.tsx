import React, { useState } from 'react'
import { createNonLocalStore } from '..'

// the api
const { fetch, post } = createNonLocalStore('createNonLocalStore_test', 'test_key_store', {
  credentials: {
    projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
    apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
    apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
  }
})

export interface CreateNonLocalStoreTestProps {
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
// eslint-disable-next-line no-empty-pattern
export const CreateNonLocalStoreTest = ({}: CreateNonLocalStoreTestProps) => {
  const [inputValue, setInput] = useState('')
  const [storeValue, setStore] = useState('')

  return (
    <>
      <div>
        <h5>current value:</h5>
        <p>{storeValue}</p>
        <button
          type='button'
          className='storybook-button'
          onClick={async () => {
            const v = await fetch()
            setStore(v?.value as string)
          }}
        >
          get
        </button>
      </div>
      <div>
        <input onChange={(e) => { setInput(e.target.value) }} />
        <button
          type='button'
          className='storybook-button'
          onClick={() => { post(inputValue) }}
        >
          set
        </button>
      </div>
    </>
  )
}
