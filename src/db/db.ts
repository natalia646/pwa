import { Dexie, type EntityTable } from "dexie";
import type { Task } from "../types/Todo.type";
import { populate } from "./todoService";

export interface SyncQueueEntry {
  id?: number;
  entityType: string;
  entityId: number;
  operation: "create" | "update" | "delete";
  payload: string;
  status: "pending" | "syncing" | "failed";
  retryCount: number;
  lastError?: string;
  createdAt: number;
  updatedAt: number;
}

const db = new Dexie("TodosDatabase") as Dexie & {
  todos: EntityTable<Task, "id">;
  syncQueue: EntityTable<SyncQueueEntry, "id">;
};

db.version(1).stores({
  todos: "id, todo, completed, userId",
});

db.version(2).stores({
  todos: "id, todo, completed, userId",
  syncQueue: "++id, [entityType+entityId], status, createdAt",
});

db.on("populate", populate);

export { db };
