import { useState, type FC } from "react";
import plusIcon from "../assets/icons/plus_icon.svg";

type InputRowProps = {
  handleAddTask: (task: string) => void;
};

export const InputRow: FC<InputRowProps> = ({ handleAddTask }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="mb-5 flex gap-3">
      <div className="flex flex-1 items-center rounded-xl bg-white px-5 py-3.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
        <input
          type="text"
          placeholder="Type your task here.."
          className="w-full bg-transparent text-base text-[#333] outline-none placeholder:text-[#a9a9a9]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              handleAddTask(inputValue.trim());
              setInputValue("");
            }
          }}
        />
      </div>
      <button
        className="flex shrink-0 items-center gap-2 rounded-xl bg-black px-5 py-3.5 text-base font-bold whitespace-nowrap text-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        onClick={() => {
          if (inputValue.trim() !== "") {
            handleAddTask(inputValue.trim());
            setInputValue("");
          }
        }}
      >
        <img src={plusIcon} alt="add" />
        Add
      </button>
    </div>
  );
};
