import { useState } from "react";
import { updateTodo, deleteTodo } from "../db/todoService";
import pencilIcon from "../assets/icons/pencil_icon.svg";
import trashIcon from "../assets/icons/trash_icon.svg";
import checkboxUnchecked from "../assets/icons/checkbox_unchecked.svg";
import checkboxChecked from "../assets/icons/checkbox_checked.svg";
import type { FC } from "react";
import type { Task } from "../types/Todo.type";

export const TaskItem: FC<{ task: Task }> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.todo);

  const handleToggle = () => {
    updateTodo(task.id!, { completed: !task.completed });
  };

  const handleDelete = () => {
    deleteTodo(task.id!);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.todo) {
      updateTodo(task.id!, { todo: trimmed });
    } else {
      setEditValue(task.todo);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      setEditValue(task.todo);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
      <button className="shrink-0" onClick={handleToggle}>
        <img src={task.completed ? checkboxChecked : checkboxUnchecked} alt="" />
      </button>

      {isEditing ? (
        <input
          className="flex-1 border-b border-[#333] bg-transparent text-base text-[#333] outline-none md:text-lg"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 text-base md:text-lg ${
            task.completed ? "text-[#6a7282] line-through" : "text-[#333]"
          }`}
        >
          {task.todo}
        </span>
      )}

      <button
        className="shrink-0 p-1"
        onClick={() => { setEditValue(task.todo); setIsEditing(true); }}
      >
        <img src={pencilIcon} alt="edit" />
      </button>
      <button className="shrink-0 p-1" onClick={handleDelete}>
        <img src={trashIcon} alt="delete" />
      </button>
    </div>
  );
};
