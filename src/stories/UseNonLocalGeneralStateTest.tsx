import React, { useState } from 'react'
import { useNonLocalGeneralState } from '..'

export interface UseNonLocalGeneralStateTestProps {
  dataType?: 'string' | 'number' | 'object' | 'array'
}

export const UseNonLocalGeneralStateTest = ({ dataType = 'object' }: UseNonLocalGeneralStateTestProps) => {
  const [inputValue, setInputValue] = useState('')

  const [value, actions, error, isLoading] = useNonLocalGeneralState('useNonLocalGeneralState_test', 'test_key', {
    credentials: {
      projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
      apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
      apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>General State Hook Test ({dataType})</h3>
        <p><strong>Current Value:</strong></p>
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto'
        }}
        >
          {JSON.stringify(value, null, 2)}
        </pre>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error:</strong> {error.message || String(error)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Set Value</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${dataType} value...`}
            style={{ flex: 1, padding: '8px' }}
          />
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={() => {
              try {
                const parsed = JSON.parse(inputValue)
                actions.setItem(parsed)
                // eslint-disable-next-line no-unused-vars
              } catch (e) {
                actions.setItem(inputValue)
              }
              setInputValue('')
            }}
          >
            Set Item
          </button>
        </div>
      </div>

      {(dataType === 'array' || Array.isArray(value)) && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Array Operations</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Element to push'
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => {
                try {
                  const parsed = JSON.parse(inputValue)
                  actions.push(parsed)
                  // eslint-disable-next-line no-unused-vars
                } catch (e) {
                  actions.push(inputValue)
                }
                setInputValue('')
              }}
            >
              Push
            </button>
          </div>
        </div>
      )}

      {(dataType === 'object' || (value && typeof value === 'object' && !Array.isArray(value))) && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Object Operations</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type='text'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Object to merge, e.g., {"key": "value"}'
              style={{ flex: 1, padding: '8px' }}
            />
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => {
                try {
                  const parsed = JSON.parse(inputValue)
                  actions.merge(parsed)
                  setInputValue('')
                  // eslint-disable-next-line no-unused-vars
                } catch (e) {
                  alert('Invalid JSON format')
                }
              }}
            >
              Merge
            </button>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type='text'
              placeholder='Path (e.g., user.name)'
              style={{ padding: '8px' }}
              onChange={(e) => setInputValue(e.target.value.split('|')[0] + '|' + (e.target.value.split('|')[1] || ''))}
            />
            <input
              type='text'
              placeholder='Value'
              style={{ padding: '8px' }}
              onChange={(e) => setInputValue((inputValue.split('|')[0] || '') + '|' + e.target.value)}
            />
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => {
                const [path, val] = inputValue.split('|')
                if (path && val) {
                  try {
                    const parsed = JSON.parse(val)
                    actions.setIn(path, parsed)
                    // eslint-disable-next-line no-unused-vars
                  } catch (e) {
                    actions.setIn(path, val)
                  }
                  setInputValue('')
                }
              }}
            >
              Set In
            </button>
          </div>
        </div>
      )}

      <div>
        <h4>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {dataType === 'string' && (
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => actions.setItem('Hello World!')}
            >
              Set "Hello World!"
            </button>
          )}
          {dataType === 'number' && (
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => actions.setItem(42)}
            >
              Set 42
            </button>
          )}
          {dataType === 'array' && (
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => actions.setItem(['item1', 'item2', 'item3'])}
            >
              Set Sample Array
            </button>
          )}
          {dataType === 'object' && (
            <button
              type='button'
              className='storybook-button storybook-button--secondary'
              onClick={() => actions.setItem({ name: 'John', age: 30, active: true })}
            >
              Set Sample Object
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
