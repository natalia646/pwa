import { db } from "./db";
import type { Task } from "../types/Todo.type";

const API_URL = "https://6a268fbca84f9d39e9076e50.mockapi.io/todos";

export async function populate() {
  const response: Task[] = await fetch(API_URL)
    .then((res) => {
      console.log("Fetched tasks: ", res);
      return res.json();
    })
    .then((data) => {
      console.log("Parsed tasks: ", data);
      return data;
    })
    .catch((err) => {
      console.error("Failed to fetch tasks: ", err);
      return [];
    });

  await db.todos.bulkAdd([...response]);
}
