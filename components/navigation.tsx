import { Settings, HelpCircle, User } from "lucide-react"

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-white text-lg">M</span>
        </div>
        <span className="text-lg font-semibold text-white">MINORE - Page Generator</span>
      </div>
      

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={20} className="text-slate-400 hover:text-slate-200" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <HelpCircle size={20} className="text-slate-400 hover:text-slate-200" />
        </button>
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <User size={20} className="text-slate-400 hover:text-slate-200" />
        </button>
      </div>
    </nav>
  )
}
