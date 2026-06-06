import { TaskItem } from "./components/Task";
import { Filter } from "./components/Filter";
import { InputRow } from "./components/InputRow";
// import { UserSideBar } from "./components/UserSideBar";
import { useEffect, useState } from "react";
import type { Task } from "./types/Todo.type";
import { db } from "./db/db";
import { useLiveQuery } from "dexie-react-hooks";

export default function App() {
  // const [tasks, setTasks] = useState<Task[]>([]);

  const lists = useLiveQuery(() => db.todos.toArray());
  const activeCount = lists?.filter((t) => !t.completed).length || 0;
  
  if (!lists) return null;

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      {/* <UserSideBar /> */}

      <main className="flex min-h-screen flex-1 flex-col justify-center">
        <div className="w-full max-w-2xl flex-1 px-4 py-4 md:px-10">
          <h1 className="mb-6 text-[26px] font-bold text-[#333] md:text-[36px]">
            My Tasks
          </h1>

          <InputRow />

          {lists.length > 0 ? (
            <div>
              <Filter activeCount={activeCount} />
              <div className="flex flex-col gap-3">
                {lists?.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </main>
    </div>
  );
}
