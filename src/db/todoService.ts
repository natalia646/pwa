import { db } from "./db";
import type { SyncQueueEntry } from "./db";
import type { Task } from "../types/Todo.type";

const API_URL = "https://dummyjson.com/todos";

export async function populate(): Promise<void> {
  const response: Task[] = await fetch(API_URL)
    .then((res) => res.json())
    .then((data: { todos: Task[] }) => data.todos)
    .catch(() => []);
  await db.todos.bulkAdd(response);
}

// ---------------------------------------------------------------------------
// CRUD — optimistic writes + sync queue
// ---------------------------------------------------------------------------

export async function getTodos(): Promise<Task[]> {
  return db.todos.toArray();
}

export async function addTodo(todo: Omit<Task, "id">): Promise<void> {
  const tempId = Date.now();
  const newTodo: Task = { ...todo, id: tempId };

  await db.transaction("rw", db.todos, db.syncQueue, async () => {
    await db.todos.add(newTodo);
    await enqueue({
      entityType: "todos",
      entityId: tempId,
      operation: "create",
      payload: JSON.stringify(newTodo),
      status: "pending",
      retryCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });

  await requestBackgroundSync();
}

export async function updateTodo(
  id: number,
  changes: Partial<Omit<Task, "id">>,
): Promise<void> {
  await db.transaction("rw", db.todos, db.syncQueue, async () => {
    await db.todos.update(id, changes);
    const updated = await db.todos.get(id);
    if (!updated) return;

    await enqueue({
      entityType: "todos",
      entityId: id,
      operation: "update",
      payload: JSON.stringify(updated),
      status: "pending",
      retryCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  });

  await requestBackgroundSync();
}

export async function deleteTodo(id: number): Promise<void> {
  await db.transaction("rw", db.todos, db.syncQueue, async () => {
    await db.todos.delete(id);

    const existing = await db.syncQueue
      .where("[entityType+entityId]")
      .equals(["todos", id])
      .and((e) => e.status !== "syncing")
      .first();

    if (existing?.operation === "create") {
      await db.syncQueue.delete(existing.id!);
    } else {
      await enqueue({
        entityType: "todos",
        entityId: id,
        operation: "delete",
        payload: JSON.stringify({ id }),
        status: "pending",
        retryCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  });

  await requestBackgroundSync();
}

// ---------------------------------------------------------------------------
// Sync queue helpers
// ---------------------------------------------------------------------------

async function enqueue(entry: Omit<SyncQueueEntry, "id">): Promise<void> {
  const existing = await db.syncQueue
    .where("[entityType+entityId]")
    .equals([entry.entityType, entry.entityId])
    .and((e) => e.status !== "syncing")
    .first();

  if (existing?.id !== undefined) {
    // Preserve 'create' operation — the item still hasn't reached the server.
    const operation =
      existing.operation === "create" && entry.operation === "update"
        ? "create"
        : entry.operation;

    await db.syncQueue.update(existing.id, {
      operation,
      payload: entry.payload,
      status: "pending",
      updatedAt: Date.now(),
    });
  } else {
    await db.syncQueue.add(entry);
  }
}

async function requestBackgroundSync(): Promise<void> {
  if ("SyncManager" in window && "serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await (
        reg as ServiceWorkerRegistration & {
          sync: { register(tag: string): Promise<void> };
        }
      ).sync.register("sync-todos");
    } catch {
      await syncNow();
    }
  } else {
    await syncNow();
  }
}

// ---------------------------------------------------------------------------
// syncNow — fallback for browsers without Background Sync API
// ---------------------------------------------------------------------------

export async function syncNow(): Promise<void> {
  if (!navigator.onLine) return;

  const pending = await db.syncQueue
    .where("status")
    .anyOf(["pending", "failed"])
    .toArray();

  for (const entry of pending) {
    try {
      await processEntry(entry);
      await db.syncQueue.delete(entry.id!);
    } catch (err) {
      await db.syncQueue.update(entry.id!, {
        status: "failed",
        retryCount: entry.retryCount + 1,
        lastError: err instanceof Error ? err.message : String(err),
        updatedAt: Date.now(),
      });
    }
  }
}

async function processEntry(entry: SyncQueueEntry): Promise<void> {
  const payload = JSON.parse(entry.payload) as Task;

  if (entry.operation === "create") {
    const { id: tempId, ...body } = payload;
    const created: Task = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(`POST /todos failed: ${res.status}`);
      return res.json();
    });

    await db.transaction("rw", db.todos, async () => {
      await db.todos.delete(tempId!);
      await db.todos.add(created);
    });
  } else if (entry.operation === "update") {
    const { id, ...body } = payload;
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(`PUT /todos/${id} failed: ${res.status}`);
    });
  } else if (entry.operation === "delete") {
    await fetch(`${API_URL}/${entry.entityId}`, {
      method: "DELETE",
    }).then((res) => {
      if (!res.ok)
        throw new Error(
          `DELETE /todos/${entry.entityId} failed: ${res.status}`,
        );
    });
  }
}
