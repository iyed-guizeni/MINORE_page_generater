import { Save } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Saved Pages Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Save size={16} className="text-red-500" />
            <h3 className="font-semibold text-white text-sm">Saved Pages</h3>
          </div>
          <div className="space-y-2">
            {["Dashboard", "Landing Page", "Profile"].map((page, i) => (
              <div
                key={i}
                className="bg-slate-900 hover:bg-slate-800 rounded-lg p-2 text-xs text-slate-300 cursor-pointer transition-colors border border-slate-800"
              >
                {page}
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
