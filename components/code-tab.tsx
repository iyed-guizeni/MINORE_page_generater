"use client"

import { Copy, Download, Loader, Check } from "lucide-react"
import { useState } from "react"

interface CodeTabProps {
  code: string
  isGenerating: boolean
}

export default function CodeTab({ code, isGenerating }: CodeTabProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([code], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "generated-page.tsx"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-900">
      {isGenerating ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader size={32} className="text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-400">Generating code...</p>
          </div>
        </div>
      ) : code ? (
        <>
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400">generated-page.tsx</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
              >
                <Download size={14} />
                Download
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap break-words">
              <code>{code}</code>
            </pre>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-slate-400 text-lg">No code generated yet</p>
            <p className="text-slate-500 text-sm mt-1">Enter a prompt and click Generate to see the code</p>
          </div>
        </div>
      )}
    </div>
  )
}
