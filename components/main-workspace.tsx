"use client"

import { ArrowRight } from "lucide-react"
import PreviewTab from "./preview-tab"
import CodeTab from "./code-tab"

interface MainWorkspaceProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onGenerate: () => void
  isGenerating: boolean
  activeTab: "preview" | "code"
  setActiveTab: (tab: "preview" | "code") => void
  generatedCode: string
}

export default function MainWorkspace({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  activeTab,
  setActiveTab,
  generatedCode,
}: MainWorkspaceProps) {
  return (
    <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
      {/* Prompt Section */}
      <div className="p-6 border-b border-slate-800">
        <label className="block text-sm font-medium text-slate-300 mb-3">Describe your page in natural language…</label>
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build me a beautiful hero section with a call-to-action button and testimonials..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
            rows={3}
          />
          <button
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-6 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-lg hover:shadow-red-500/25"
          >
            {isGenerating ? "Generating..." : "Generate"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-6">
        {["Preview", "Code"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase() as "preview" | "code")}
            className={`px-4 py-4 font-medium text-sm transition-colors border-b-2 ${
              activeTab === tab.toLowerCase()
                ? "text-red-500 border-b-red-500"
                : "text-slate-400 border-b-transparent hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "preview" ? (
          <PreviewTab code={generatedCode} isGenerating={isGenerating} />
        ) : (
          <CodeTab code={generatedCode} isGenerating={isGenerating} />
        )}
      </div>
    </main>
  )
}
