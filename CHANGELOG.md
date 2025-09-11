# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3](https://github.com/vaultrice/react/compare/v1.0.2...v1.0.3) - 2025-09-11

- update dependencies

## [1.0.2](https://github.com/vaultrice/react/compare/v1.0.1...v1.0.2) - 2025-09-08

- improve return types for hooks

## [1.0.1](https://github.com/vaultrice/react/compare/v1.0.0...v1.0.1) - 2025-09-08

- Enhanced `useMessaging` hook with flexible calling patterns:
  - `useMessaging(id, onMessage, options)` - with message callback
  - `useMessaging(id, options)` - without message callback
- Added `connectionId` to `useMessaging` return tuple for identifying current user's connection
- Smart connection deduplication in `useMessaging`:
  - Always includes `connectionId` as base deduplication key
  - When no `deduplicateBy` option is provided but connection has data, deduplicates by all data properties
  - Custom deduplication via `deduplicateBy` option (single property or array of properties)
- Current user's connection is always positioned first in the connected users array

## [1.0.0](https://github.com/vaultrice/react/compare/v0.9.8...v1.0.0) - 2025-09-06

- First official stable release. This marks it as production-ready.
- Added splice() array helper (server + offline behavior) for in-place remove/replace operations on array values.
- Optional Optimistic Concurrency Control (OCC): all write operations can accept an optional `updatedAt` value to enable conflict detection (server returns HTTP 409 on mismatch). Supported across setItem, setItems, increment, decrement, merge, push, setIn, splice.
- Public API is considered stable; any future breaking changes will require a major version bump per SemVer.
- No migration steps required for users upgrading from 0.9.x.
- Thanks to all contributors and early adopters.

## [0.9.8](https://github.com/vaultrice/react/compare/v0.9.7...v0.9.8) - 2025-09-05

- `useNonLocalArray` – Array management with atomic push operations
- `useNonLocalObject` – Object management with merge and nested setIn operations  
- `useNonLocalGeneralState` – General state with setItem, push, merge and setIn operations available

## [0.9.7](https://github.com/vaultrice/react/compare/v0.9.6...v0.9.7) - 2025-08-31

- fix internal buildKey function

## [0.9.6](https://github.com/vaultrice/react/compare/v0.9.5...v0.9.6) - 2025-08-28

- update dependencies

## [0.9.5](https://github.com/vaultrice/react/compare/v0.9.4...v0.9.5) - 2025-08-28

- update dependencies

## [0.9.4](https://github.com/vaultrice/react/compare/v0.9.3...v0.9.4) - 2025-08-27

- introduce isLoading

## [0.9.3](https://github.com/vaultrice/react/compare/v0.9.2...v0.9.3) - 2025-08-27

- update dependencies

## [0.9.2](https://github.com/vaultrice/react/compare/v0.9.1...v0.9.2) - 2025-08-27

- fix react in peer dependencies

## [0.9.1](https://github.com/vaultrice/react/compare/v0.9.0...v0.9.1) - 2025-08-25

- update dependencies

## [0.9.0] - 2025-08-21

### Added
- Initial public release of Vaultrice React SDK.
- `useNonLocalState` – React hook for real-time, offline-first state management.
- `useMultiNonLocalStates` – Manage multiple keys atomically.
- `useNonLocalCounter` – Atomic increment/decrement for counters.
- `useMessaging` – Real-time messaging and presence.
- `createNonLocalStore` – Simple fetch/post API for a single key.
- `vaultrice.init` – Global credentials initialization helper.
- `prepareOfflineNonLocalStorage` – Helper for offline-capable storage.
- Type definitions for all hooks and helpers.
- Example Storybook components for all core hooks.

### Changed
- Internal refactoring for hook composition and error handling.

### Documentation
- Added comprehensive README with usage, examples, and API documentation.
