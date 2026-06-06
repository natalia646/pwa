import pencilIcon from "../assets/icons/pencil_icon.svg";
import trashIcon from "../assets/icons/trash_icon.svg";
import checkboxUnchecked from "../assets/icons/checkbox_unchecked.svg";
import checkboxChecked from "../assets/icons/checkbox_checked.svg";
import type { FC } from "react";
import type { Task } from "../types/Todo.type";


export const TaskItem: FC<{ task: Task }> = ({ task }) => {
  return (
    <div
      key={task.id}
      className="flex items-center gap-3 rounded-xl bg-white px-4 py-5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
    >
      <button className="shrink-0">
        <img
          src={task.completed ? checkboxChecked : checkboxUnchecked}
          alt=""
        />
      </button>
      <span
        className={`flex-1 text-base md:text-lg ${
          task.completed ? "text-[#6a7282] line-through" : "text-[#333]"
        }`}
      >
        {task.todo}
      </span>
      <button className="shrink-0 p-1">
        <img src={pencilIcon} alt="edit" />
      </button>
      <button className="shrink-0 p-1">
        <img src={trashIcon} alt="delete" />
      </button>
    </div>
  );
};
