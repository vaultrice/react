import React, { useState, useEffect } from 'react'
import { useNonLocalArray } from '..'

export interface UseNonLocalArrayTestProps {
  initialItems?: any[]
}

/** Primary UI component for testing useNonLocalArray hook */
export const UseNonLocalArrayTest = ({ initialItems = [] }: UseNonLocalArrayTestProps) => {
  const [inputValue, setInput] = useState('')
  const [initialized, setInitialized] = useState(false)

  // include splice in the actions destructure
  const [array, { push, setArray, splice }, error, isLoading] = useNonLocalArray<any>('useNonLocalArray_test', 'test_key', {
    credentials: {
      projectId: import.meta.env.VITE_VAULTRICE_PROJECTID,
      apiKey: import.meta.env.VITE_VAULTRICE_APIKEY,
      apiSecret: import.meta.env.VITE_VAULTRICE_APISECRET
    }
  })

  // splice inputs
  const [spliceStart, setSpliceStart] = useState('')
  const [spliceDeleteCount, setSpliceDeleteCount] = useState('')
  const [spliceItemsInput, setSpliceItemsInput] = useState('')

  // Initialize array with provided initial items
  useEffect(() => {
    if (!initialized && !isLoading && initialItems.length > 0) {
      setArray(initialItems)
      setInitialized(true)
    }
  }, [initialItems, setArray, initialized, isLoading])

  const handlePushString = () => {
    if (inputValue.trim()) {
      push(inputValue.trim())
      setInput('')
    }
  }

  const handlePushNumber = () => {
    const num = parseFloat(inputValue)
    if (!isNaN(num)) {
      push(num)
      setInput('')
    }
  }

  const handleSetArray = () => {
    try {
      const parsedArray = JSON.parse(inputValue)
      if (Array.isArray(parsedArray)) {
        setArray(parsedArray)
        setInput('')
      } else {
        alert('Please enter a valid JSON array')
      }
      // eslint-disable-next-line no-unused-vars
    } catch (e) {
      alert('Invalid JSON format')
    }
  }

  const handleClearArray = () => {
    setArray([])
  }

  // splice handler
  const handleSplice = () => {
    const start = parseInt(spliceStart, 10)
    const deleteCount = parseInt(spliceDeleteCount, 10)

    if (Number.isNaN(start) || Number.isNaN(deleteCount)) {
      alert('Start index and delete count must be valid integers')
      return
    }

    let items: any[] | undefined
    if (spliceItemsInput.trim()) {
      try {
        const parsed = JSON.parse(spliceItemsInput)
        if (!Array.isArray(parsed)) {
          alert('Items must be a JSON array (e.g. ["a", "b"])')
          return
        }
        items = parsed
        // eslint-disable-next-line no-unused-vars
      } catch (e) {
        alert('Invalid JSON for items')
        return
      }
    }

    splice(start, deleteCount, items)
    setSpliceStart('')
    setSpliceDeleteCount('')
    setSpliceItemsInput('')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>Array Hook Test</h3>
        <p><strong>Current Array:</strong></p>
        <div style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          minHeight: '40px'
        }}
        >
          {JSON.stringify(array, null, 2)}
        </div>
        <p><strong>Length:</strong> {array?.length || 0}</p>
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error:</strong> {error.message || String(error)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Add Items</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter value to add...'
            style={{ flex: 1, padding: '8px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handlePushString}
            disabled={!inputValue.trim()}
          >
            Push as String
          </button>
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handlePushNumber}
            disabled={isNaN(parseFloat(inputValue))}
          >
            Push as Number
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Quick Actions</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => push(`Item ${(array?.length || 0) + 1}`)}
          >
            Add Default Item
          </button>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => push(Math.floor(Math.random() * 100))}
          >
            Add Random Number
          </button>
          <button
            type='button'
            className='storybook-button storybook-button--secondary'
            onClick={() => setArray(['apple', 'banana', 'cherry'])}
          >
            Set Fruits
          </button>
          <button
            type='button'
            className='storybook-button'
            onClick={handleClearArray}
          >
            Clear Array
          </button>
        </div>
      </div>

      {/* Splice UI */}
      <div style={{ marginBottom: '20px' }}>
        <h4>Splice (remove/insert/replace)</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <input
            type='number'
            value={spliceStart}
            onChange={(e) => setSpliceStart(e.target.value)}
            placeholder='start index'
            style={{ padding: '8px', width: '120px' }}
          />
          <input
            type='number'
            value={spliceDeleteCount}
            onChange={(e) => setSpliceDeleteCount(e.target.value)}
            placeholder='delete count'
            style={{ padding: '8px', width: '120px' }}
          />
          <input
            type='text'
            value={spliceItemsInput}
            onChange={(e) => setSpliceItemsInput(e.target.value)}
            placeholder='items JSON (e.g. ["x", 1])'
            style={{ flex: 1, padding: '8px' }}
          />
        </div>
        <div>
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handleSplice}
          >
            Splice
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Provide start index and delete count. Optionally provide a JSON array of items to insert.
          </p>
        </div>
      </div>

      <div>
        <h4>Set Entire Array (JSON)</h4>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type='text'
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g., ["item1", "item2", 3, true]'
            style={{ flex: 1, padding: '8px' }}
          />
          <button
            type='button'
            className='storybook-button storybook-button--primary'
            onClick={handleSetArray}
            disabled={!inputValue.trim()}
          >
            Set Array
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#666' }}>
          Enter a valid JSON array format, e.g., {'["string", 123, true, {"key": "value"}]'}
        </p>
      </div>
    </div>
  )
}
