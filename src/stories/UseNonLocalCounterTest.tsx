import React, { useState } from 'react'
import { useNonLocalCounter } from '..'

export interface UseNonLocalCounterTestProps {
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
export const UseNonLocalCounterTest = ({}: UseNonLocalCounterTestProps) => {
  const [value, increment, decrement] = useNonLocalCounter('useNonLocalCounter_test', 'test_key', {
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
        <p>{value}</p>
      </div>
      <div>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { increment() }}
        >
          increment +1
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { increment(10) }}
        >
          increment +10
        </button>
        <button
          type='button'
          className='storybook-button'
          onClick={() => { decrement() }}
        >
          decrement -1
        </button>
      </div>
    </>
  )
}
