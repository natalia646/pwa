import { db } from "./db";
import type { Task } from "../types/Todo.type";

const API_URL = "https://dummyjson.com/todos";

export async function populate() {
  const response: Task[] = await fetch(API_URL + "?limit=3&skip=10")
    .then((res) => {
      console.log("Fetched tasks: ", res);
      return res.json();
    })
    .then((data) => {
      console.log("Parsed tasks: ", data.todos);
      return data.todos;
    })
    .catch((err) => {
      console.error("Failed to fetch tasks: ", err);
      return [];
    });

  await db.todos.bulkAdd([...response]);
}
