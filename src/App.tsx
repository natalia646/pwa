const TASKS = [
  { id: 1, text: 'Learn React', completed: false },
  { id: 2, text: 'Prototyping To-Do List', completed: true },
  { id: 3, text: 'Push to Github', completed: false },
]

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function CheckboxUnchecked() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}

function CheckboxChecked() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#333" />
      <polyline points="9 12 11 14 15 10" stroke="white" strokeWidth="2" fill="none" />
    </svg>
  )
}

function ListTodoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="M15 6h6" />
      <path d="M15 12h6" />
      <path d="M9 12l2 2 4-4" />
      <path d="M3 19h18" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

export default function App() {
  const activeCount = TASKS.filter((t) => !t.completed).length

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex">
      {/* Sidebar — hidden on mobile, shown from md */}
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
            <ListTodoIcon />
            My Tasks
          </button>
          <button className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[#333] text-base w-full text-left hover:bg-[#f9fafb] transition-colors">
            <SettingsIcon />
            Settings
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="flex items-center px-4 md:px-10 pt-5 pb-2">
          <button className="md:hidden text-[#333] p-1 mr-2">
            <MenuIcon />
          </button>
          <div className="flex-1" />
          <button className="text-[#333] p-1">
            <MoonIcon />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 px-4 md:px-10 py-4 w-full max-w-2xl">
          <h1 className="text-[26px] md:text-[36px] font-bold text-[#333] mb-6">
            My Tasks
          </h1>

          {/* Input row */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.15)] px-5 py-3.5 flex items-center">
              <input
                type="text"
                placeholder="Type your task here.."
                className="w-full text-base outline-none bg-transparent placeholder:text-[#a9a9a9] text-[#333]"
                readOnly
              />
            </div>
            <button className="bg-black text-white rounded-xl px-5 py-3.5 flex items-center gap-2 font-bold text-base shadow-[0_2px_4px_rgba(0,0,0,0.25)] whitespace-nowrap shrink-0">
              <PlusIcon />
              Add
            </button>
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-between mb-4 text-sm md:text-base">
            <div className="text-[#6a7282]">
              <span className="text-[#333] font-semibold">All</span>
              {' | Active | Completed'}
            </div>
            <span className="text-[#6a7282]">{activeCount} tasks left</span>
          </div>

          {/* Task list */}
          <div className="flex flex-col gap-3">
            {TASKS.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.15)] px-4 py-5 flex items-center gap-3"
              >
                <button className="shrink-0">
                  {task.completed ? <CheckboxChecked /> : <CheckboxUnchecked />}
                </button>
                <span
                  className={`flex-1 text-base md:text-lg ${
                    task.completed ? 'text-[#6a7282] line-through' : 'text-[#333]'
                  }`}
                >
                  {task.text}
                </span>
                <button className="shrink-0 p-1 text-[#6a7282] hover:text-[#333] transition-colors">
                  <PencilIcon />
                </button>
                <button className="shrink-0 p-1 text-[#6a7282] hover:text-[#333] transition-colors">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="py-6 text-center text-[#6a7282] text-sm">
          © 2025
        </footer>
      </main>
    </div>
  )
}
