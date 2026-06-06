import listTodoIcon from "./assets/icons/list_todo_icon.svg";
import settingsIcon from "./assets/icons/settings_icon.svg";

export const UserSideBar = () => {
  return (
    <aside className="hidden md:flex flex-col bg-white shadow-[4px_0_12px_rgba(0,0,0,0.08)] w-64 lg:w-72 shrink-0 min-h-screen">
      {/* Profile */}
      <div className="flex flex-col items-center pt-12 pb-6 px-6">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-[#e5e7eb]">
          <img
            src="https://www.figma.com/api/mcp/asset/9700ee72-4269-4768-bd42-affe3bef3d83"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="font-bold text-[#333] text-lg">Jane Doe</p>
        <p className="text-[#6a7282] text-sm mt-0.5">janedoe@gmail.com</p>
      </div>

      <div className="mx-6 border-t border-[#e5e7eb]" />

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-4 mt-4">
        <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-[#f3f4f6] text-[#333] font-bold text-base w-full text-left">
          <img src={listTodoIcon} alt="" />
          My Tasks
        </button>
        <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#333] text-base w-full text-left hover:bg-[#f9fafb] transition-colors">
          <img src={settingsIcon} alt="" />
          Settings
        </button>
      </nav>
    </aside>
  );
};
