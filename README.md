# My Tasks — PWA Todo App

A Progressive Web App (PWA) for managing tasks, built with React, TypeScript, and Vite. Works offline and syncs changes to a remote API in the background.

## Features

- **Add, edit, and delete tasks** — inline editing with keyboard support (`Enter` to save, `Escape` to cancel)
- **Complete tasks** — toggle completion status with a checkbox
- **Offline-first** — all changes are stored locally in IndexedDB via Dexie; the app is fully usable without a network connection
- **Background sync** — pending create/update/delete operations are queued and flushed to the API automatically when connectivity is restored, using the Background Sync API (with a manual fallback for unsupported browsers)
- **Service worker caching** — app shell and static assets are cached for instant load on repeat visits
- **Optimistic updates** — UI reflects changes immediately without waiting for the server

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Local database | Dexie (IndexedDB wrapper) |
| Live queries | dexie-react-hooks (`useLiveQuery`) |
| Service worker | Hand-written (`public/sw.js`) |
| Remote API | [dummyjson.com/todos](https://dummyjson.com/todos) |

## Project Structure

```
src/
├── App.tsx                  # Root component — task list + add input
├── components/
│   ├── InputRow.tsx         # Text input + Add button
│   ├── Task.tsx             # Individual task row with edit/delete
│   └── Filter.tsx           # Filter bar (prepared, not yet wired up)
├── db/
│   ├── db.ts                # Dexie database definition (todos + syncQueue tables)
│   └── todoService.ts       # CRUD operations + sync queue + background sync logic
├── types/
│   └── Todo.type.ts         # Task interface
└── assets/icons/            # SVG icons (checkbox, pencil, trash, plus, …)
public/
└── sw.js                    # Service worker — caching + Background Sync handler
```

## How the Sync Queue Works

Every write goes through a two-step optimistic process:

1. **Local write** — the change is applied to IndexedDB immediately so the UI updates without delay.
2. **Queue entry** — a record describing the operation (`create` / `update` / `delete`) is added to the `syncQueue` table.
3. **Background sync** — `requestBackgroundSync()` registers a `sync-todos` Background Sync event. When the browser fires the event (immediately if online, deferred if offline), the service worker reads the queue and flushes each entry to the REST API.
4. **Fallback** — browsers that do not support `SyncManager` call `syncNow()` directly in the main thread.

If a queue entry fails it is marked `failed` and retried on the next sync cycle.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install and run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## API

The app talks to [dummyjson.com/todos](https://dummyjson.com/todos), a free mock REST API.

| Operation | Method | Endpoint |
|---|---|---|
| Seed initial data | GET | `/todos` |
| Create task | POST | `/todos` |
| Update task | PUT | `/todos/:id` |
| Delete task | DELETE | `/todos/:id` |

> **Note:** dummyjson.com simulates responses but does not persist data between sessions. The app's IndexedDB is the source of truth.
