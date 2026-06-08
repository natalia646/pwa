import { TaskItem } from "./components/Task";
// import { Filter } from "./components/Filter";
import { InputRow } from "./components/InputRow";
import { db } from "./db/db";
import { addTodo } from "./db/todoService";
import { useLiveQuery } from "dexie-react-hooks";
import type { Task } from "./types/Todo.type";

export default function App() {
  const lists = useLiveQuery<Task[]>(() => db.todos.toArray());
  // const activeCount = lists?.filter((t) => !t.completed).length ?? 0;

  if (!lists) return null;

  const handleAddTask = async (text: string) => {
    await addTodo({ todo: text, completed: false, userId: 1 });
  };

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <main className="flex w-full items-center min-h-screen flex-1 flex-col">
        <div className="w-full max-w-2xl flex-1 px-4 py-4 md:px-10">
          <h1 className="mb-6 text-[26px] font-bold text-[#333] md:text-[36px]">
            My Tasks
          </h1>

          <InputRow handleAddTask={handleAddTask} />

          {lists.length > 0 && ( 
            <div>
              {/* <Filter activeCount={activeCount} /> */}
              <div className="flex flex-col gap-3">
                {lists.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
