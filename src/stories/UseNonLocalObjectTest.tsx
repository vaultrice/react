import React, { useState, useEffect } from 'react'
import { useNonLocalObject } from '..'

export interface UseNonLocalObjectTestProps {
  initialData?: Record<string, any>
}

export const UseNonLocalObjectTest = ({ initialData = {} }: UseNonLocalObjectTestProps) => {
  const [inputKey, setInputKey] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [inputPath, setInputPath] = useState('')
  const [inputPathValue, setInputPathValue] = useState('')
  const [initialized, setInitialized] = useState(false)

  const [object, { merge, setIn, setObject }, error, isLoading] = useNonLocalObject('useNonLocalObject_test', 'test_key', {
    credentials: {
      projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
      apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
      apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
    }
  })

  useEffect(() => {
    if (!initialized && !isLoading && Object.keys(initialData).length > 0) {
      setObject(initialData)
      setInitialized(true)
    }
  }, [initialData, setObject, initialized, isLoading])

  const handleMerge = () => {
    if (inputKey.trim() && inputValue.trim()) {
      try {
        const value = JSON.parse(inputValue)
        merge({ [inputKey]: value })
        setInputKey('')
        setInputValue('')
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        try {
          merge({ [inputKey]: inputValue })
          setInputKey('')
          setInputValue('')
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          alert('Error merging object')
        }
      }
    }
  }

  const handleSetIn = () => {
    if (inputPath.trim() && inputPathValue.trim()) {
      try {
        const value = JSON.parse(inputPathValue)
        setIn(inputPath, value)
        setInputPath('')
        setInputPathValue('')
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        setIn(inputPath, inputPathValue)
        setInputPath('')
        setInputPathValue('')
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Object Hook Test</h3>
        <p><strong>Current Object:</strong></p>
        <pre style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: '200px'
        }}
        >
          {JSON.stringify(object, null, 2)}
        </pre>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error:</strong> {error.message || String(error)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Merge Properties</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type='text'
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder='Property name'
            style={{ padding: '8px' }}
          />
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Value (JSON or string)'
            style={{ flex: 1, padding: '8px' }}
          />
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handleMerge}
            disabled={!inputKey.trim() || !inputValue.trim()}
          >
            Merge
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Set Nested Value (setIn)</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type='text'
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder='Path (e.g., user.profile.name)'
            style={{ padding: '8px' }}
          />
          <input
            type='text'
            value={inputPathValue}
            onChange={(e) => setInputPathValue(e.target.value)}
            placeholder='Value'
            style={{ flex: 1, padding: '8px' }}
          />
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handleSetIn}
            disabled={!inputPath.trim() || !inputPathValue.trim()}
          >
            Set In
          </button>
        </div>
      </div>

      <div>
        <h4>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => merge({ timestamp: new Date().toISOString() })}
          >
            Add Timestamp
          </button>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => setIn('user.profile.name', 'John Doe')}
          >
            Set User Name
          </button>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => setObject({ name: 'Sample', value: 42, active: true })}
          >
            Reset Object
          </button>
          <button
            type='button'
            className='storybook-button'
            onClick={() => setObject({})}
          >
            Clear Object
          </button>
        </div>
      </div>
    </div>
  )
}
