import { Dexie, type EntityTable } from "dexie";
import type { Task } from "../types/Todo.type";
import { populate } from "./todoService";

const db = new Dexie("TodosDatabase") as Dexie & {
  todos: EntityTable<Task, 'id'>;
};


db.version(1).stores({
  todos: "id, todo, completed, userId",
});

db.on("populate", populate);

export { db };
