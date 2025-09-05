# Vaultrice React SDK

<!-- [![Tests](https://github.com/vaultrice/react/workflows/node/badge.svg)](https://github.com/vaultrice/react/actions?query=workflow%3Anode) -->
[![npm version](https://img.shields.io/npm/v/@vaultrice/react.svg?style=flat-square)](https://www.npmjs.com/package/@vaultrice/react)

A set of React hooks and utilities for building real-time, offline-first, and optionally end-to-end encrypted applications using [Vaultrice NonLocalStorage](https://www.npmjs.com/package/@vaultrice/sdk).  
**Under the hood, @vaultrice/react uses [@vaultrice/sdk](https://www.npmjs.com/package/@vaultrice/sdk) for all storage, sync, and presence features.**

> Vaultrice is ideal for collaborative apps, cross-device sync, and privacy-sensitive use cases—without custom backend infrastructure.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Core Hooks](#core-hooks)
5. [Atomic Operations](#atomic-operations)
6. [Examples](#examples)
7. [Helpers](#helpers)
8. [Related Packages](#related-packages)

---

## Features

- **Offline-first:** Local queueing and automatic sync when online.
- **Real-time presence & messaging:** Built-in WebSocket support for live updates and user presence.
- **End-to-end encryption:** Optional client-side encryption for sensitive data.
- **Cross-device sync:** Seamless state sharing across browsers and devices.
- **TTL & metadata:** Per-key expiration and rich metadata.
- **Atomic operations:** Server-side atomic operations for counters, arrays, and objects.
- **Easy integration:** Simple React hooks for state, counters, messaging, and more.

---

## Installation

```bash
npm install @vaultrice/react
```

---

## Quick Start

```tsx
import { useNonLocalState } from '@vaultrice/react'

const [value, setValue, error] = useNonLocalState<string>('myRoom', 'myKey', {
  credentials: {
    projectId: 'YOUR_PROJECT_ID',
    apiKey: 'YOUR_API_KEY',
    apiSecret: 'YOUR_API_SECRET'
  }
})

// Use value in your UI, update with setValue(newValue)
```

---

## Core Hooks

### Basic State Management

- **`useNonLocalState`** – Manage a single value with real-time sync.
- **`useMultiNonLocalStates`** – Manage multiple keys atomically.

### Specialized Hooks

- **`useNonLocalCounter`** – Atomic increment/decrement for counters.
- **`useNonLocalArray`** – Array management with atomic push operations.
- **`useNonLocalObject`** – Object management with merge and nested operations.
- **`useNonLocalGeneralState`** – General state with all atomic operations available.

### Communication

- **`useMessaging`** – Real-time messaging and presence.

### Utilities

- **`createNonLocalStore`** – Simple fetch/post API for a single key, e.g., to be used with TanStack Query.

---

## Atomic Operations

The SDK provides powerful atomic operations that are executed server-side, preventing race conditions:

### Counter Operations

```tsx
import { useNonLocalCounter } from '@vaultrice/react'

const [count, increment, decrement, error] = useNonLocalCounter('roomId', 'counterKey', { 
  credentials: { ... } 
})

// Increment by 1 (default)
await increment()

// Increment by specific amount
await increment(5)

// Decrement by 1 (default)
await decrement()

// Decrement by specific amount
await decrement(2)
```

### Array Operations

```tsx
import { useNonLocalArray } from '@vaultrice/react'

const [items, { push, setArray }, error] = useNonLocalArray('roomId', 'listKey', { 
  credentials: { ... } 
})

// Atomically append to array
await push('new item')

// Replace entire array
await setArray(['item1', 'item2', 'item3'])
```

### Object Operations

```tsx
import { useNonLocalObject } from '@vaultrice/react'

const [user, { merge, setIn, setObject }, error] = useNonLocalObject('roomId', 'userKey', { 
  credentials: { ... } 
})

// Shallow merge into object
await merge({ name: 'John', active: true })

// Set nested value using dot notation
await setIn('profile.avatar', 'avatar.jpg')

// Replace entire object
await setObject({ name: 'John', age: 30 })
```

### General State with All Operations

```tsx
import { useNonLocalGeneralState } from '@vaultrice/react'

const [value, actions, error] = useNonLocalGeneralState('roomId', 'dataKey', { 
  credentials: { ... } 
})

// All operations available
await actions.setItem(value)
await actions.push(element)        // for arrays
await actions.merge(obj)           // for objects  
await actions.setIn(path, value)   // for nested objects
```

---

## Examples

### Collaborative Counter

```tsx
import { useNonLocalCounter } from '@vaultrice/react'

function CollaborativeCounter() {
  const [count, increment, decrement, error] = useNonLocalCounter('room1', 'counter', {
    credentials: {
      projectId: 'YOUR_PROJECT_ID',
      apiKey: 'YOUR_API_KEY',
      apiSecret: 'YOUR_API_SECRET'
    }
  })

  return (
    <div>
      <button onClick={() => increment()}>+1</button>
      <span>Count: {count}</span>
      <button onClick={() => decrement()}>-1</button>
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
```

### Collaborative Todo List

```tsx
import { useNonLocalArray } from '@vaultrice/react'

function TodoList() {
  const [todos, { push }, error] = useNonLocalArray('room1', 'todos', {
    credentials: { ... }
  })

  const addTodo = (text: string) => {
    push({ id: Date.now(), text, completed: false })
  }

  return (
    <div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
      <button onClick={() => addTodo('New task')}>Add Todo</button>
    </div>
  )
}
```

### User Profile Management

```tsx
import { useNonLocalObject } from '@vaultrice/react'

function UserProfile() {
  const [profile, { merge, setIn }, error] = useNonLocalObject('user123', 'profile', {
    credentials: { ... }
  })

  const updateEmail = (email: string) => {
    merge({ email })
  }

  const updateProfilePicture = (url: string) => {
    setIn('profile.avatar', url)
  }

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <button onClick={() => updateEmail('new@email.com')}>
        Update Email
      </button>
    </div>
  )
}
```

### Real-time Messaging

```tsx
import { useMessaging } from '@vaultrice/react'

function ChatRoom() {
  const [connected, send, join, leave, error] = useMessaging(
    'chatroom1',
    (message) => {
      console.log('Received:', message)
    },
    { credentials: { ... } }
  )

  useEffect(() => {
    join({ name: 'User123', avatar: 'avatar.jpg' })
    return () => leave()
  }, [])

  return (
    <div>
      <div>Connected users: {connected.length}</div>
      <button onClick={() => send({ text: 'Hello!', timestamp: Date.now() })}>
        Send Message
      </button>
    </div>
  )
}
```

### TanStack Query Integration

```tsx
import { createNonLocalStore } from '@vaultrice/react'
import { useQuery, useMutation } from '@tanstack/react-query'

const userStore = createNonLocalStore('users', 'current-user', {
  credentials: { ... }
})

function UserData() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userStore.fetch
  })

  const updateUser = useMutation({
    mutationFn: userStore.post
  })

  return (
    <div>
      {isLoading ? 'Loading...' : user?.value?.name}
      <button onClick={() => updateUser.mutate({ name: 'New Name' })}>
        Update
      </button>
    </div>
  )
}
```

---

## Helpers

### Global Credentials

You can initialize your credentials in a single place to be reused:

```tsx
// e.g., in your index.ts
import { vaultrice } from '@vaultrice/react'

vaultrice.init({
  projectId: 'YOUR_PROJECT_ID',
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET'
})

// in your components - credentials are automatically used
import { useNonLocalState } from '@vaultrice/react'

const [value, setValue] = useNonLocalState<string>('objectId', 'myKey')
```

### Offline-capable NonLocalStorage

To take advantage of the [offline-capable NonLocalStorage](https://vaultrice.github.io/sdk/functions/createOfflineNonLocalStorage.html), prepare the instances before usage:

```tsx
// e.g., in your index.ts
import { prepareOfflineNonLocalStorage } from '@vaultrice/react'

await prepareOfflineNonLocalStorage('objectId', credentials)

// in your components - it will automatically use the prepared offline variant
import { useNonLocalState } from '@vaultrice/react'

const [value, setValue] = useNonLocalState<string>('objectId', 'myKey')
```

---

## Hook Reference

### useNonLocalState
```tsx
const [value, setValue, error, isLoading] = useNonLocalState<T>(id, key, options)
```

### useNonLocalCounter  
```tsx
const [count, increment, decrement, error, isLoading] = useNonLocalCounter(id, key, options)
```

### useNonLocalArray
```tsx
const [array, { push, setArray }, error, isLoading] = useNonLocalArray<T>(id, key, options)
```

### useNonLocalObject
```tsx
const [object, { merge, setIn, setObject }, error, isLoading] = useNonLocalObject<T>(id, key, options)
```

### useNonLocalGeneralState
```tsx
const [value, { setItem, push, merge, setIn }, error, isLoading] = useNonLocalGeneralState<T>(id, key, options)
```

### useMultiNonLocalStates
```tsx
const [values, setItems, error, isLoading] = useMultiNonLocalStates(id, keys, options)
```

### useMessaging
```tsx
const [connected, send, join, leave, error] = useMessaging(id, onMessage, options)
```

---

## Related Packages

- [Vaultrice TS/JS SDK](https://github.com/vaultrice/sdk)
- [Vaultrice React.js Components](https://github.com/vaultrice/react-components)

## Support

Have questions, ideas or feedback? [Open an issue](https://github.com/vaultrice/react) or email us at [support@vaultrice.com](mailto:support@vaultrice.com)

---

Made with ❤️ for developers who need real-time storage, without the backend hassle.

**Try Vaultrice for [free](https://www.vaultrice.app/register)!**
