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
5. [Example: Collaborative Counter](#example-collaborative-counter)
6. [Helpers](#helpers)

---

## Features

- **Offline-first:** Local queueing and automatic sync when online.
- **Real-time presence & messaging:** Built-in WebSocket support for live updates and user presence.
- **End-to-end encryption:** Optional client-side encryption for sensitive data.
- **Cross-device sync:** Seamless state sharing across browsers and devices.
- **TTL & metadata:** Per-key expiration and rich metadata.
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

- `useNonLocalState` – Manage a single value with real-time sync.
- `useMultiNonLocalStates` – Manage multiple keys atomically.
- `useNonLocalCounter` – Atomic increment/decrement for counters.
- `useMessaging` – Real-time messaging and presence.
- `createNonLocalStore` – Simple fetch/post API for a single key, eg. to be used with tanstack query / mutation.

---

## Example: Collaborative Counter

```tsx
import { useNonLocalCounter } from '@vaultrice/react'

const [count, increment, decrement, error] = useNonLocalCounter('roomId', 'counterKey', { credentials: { ... } })

<button onClick={() => increment()}>+1</button>
<button onClick={() => decrement()}>-1</button>
<p>Current count: {count}</p>
```

---

## Helpers


### credentials

You can initialize your credentials in a single place to be reused:

```tsx
// eg. in your index.ts
import { vaultrice } from '@vaultrice/react'

vaultrice.init(credentials)

// in your components
import { useNonLocalState } from '@vaultrice/react'

const [value, setValue] = useNonLocalState<string>('objectId', 'myKey'}

```

### offline-capable NonLocalStorage

To take advantage of the [offline-capable NonLocalStorage](https://vaultrice.github.io/sdk/functions/createOfflineNonLocalStorage.html) you will have to prepare the instances before usage, like:
```tsx
// eg. in your index.ts
import { prepareOfflineNonLocalStorage } from '@vaultrice/react'

prepareOfflineNonLocalStorage('objectId', credentials)

// in your components it will pick up the prepared offline variant
import { useNonLocalState } from '@vaultrice/react'

const [value, setValue] = useNonLocalState<string>('objectId', 'myKey'}

```

## Support

Have questions, ideas or feedback? [Open an issue](https://github.com/vaultrice/react) or email us at [support@vaultrice.com](mailto:support@vaultrice.com)

---

Made with ❤️ for developers who need real-time storage, without the backend hassle.

**Try Vaultrice for [free](https://www.vaultrice.app/register)!**
