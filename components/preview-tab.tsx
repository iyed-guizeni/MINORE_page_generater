"use client"

import { Loader, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { isValidReactCode } from "@/lib/code-sanitizer"

interface PreviewTabProps {
  code: string
  isGenerating: boolean
}

export default function PreviewTab({ code, isGenerating }: PreviewTabProps) {
  const [iframeHtml, setIframeHtml] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!code) {
      setIframeHtml("")
      setError("")
      return
    }

    try {
      // Validate code is safe
      if (!isValidReactCode(code)) {
        setError("Generated code appears to be invalid or unsafe")
        setIframeHtml("")
        return
      }

      // Clean up the code - remove imports, exports, and 'use client'
      let cleanedCode = code
        .replace(/import\s+.*from\s+['"][^'"]*['"]/g, "") // Remove all import statements
        .replace(/^['"]use client['"];?\n*/i, "") // Remove 'use client'
        .trim()

      // Extract component name from the code
      let componentName = "App"
      const componentMatch = cleanedCode.match(/(?:function|const)\s+(\w+)\s*(?:\(|=)/)
      if (componentMatch && componentMatch[1]) {
        componentName = componentMatch[1]
      }

      // Remove export default
      cleanedCode = cleanedCode.replace(/export\s+default\s+/g, "")

      console.log("Component name:", componentName)
      console.log("Cleaned code:", cleanedCode)

      // Create HTML for iframe with the cleaned code
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone@7/babel.min.js"><\/script>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: white; }
    #root { width: 100%; min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    (function() {
      try {
        const { useState, useEffect, Fragment } = React;
        
        ${cleanedCode}

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<${componentName} />);
      } catch (error) {
        console.error('Render error:', error);
        const root = document.getElementById('root');
        root.innerHTML = '<div style="padding: 20px; color: red; font-family: monospace;"><h2>Preview Error:</h2><pre>' + (error.stack || error.message) + '</pre></div>';
      }
    })();
  <\/script>
</body>
</html>`

      console.log("Generated iframe HTML")
      setIframeHtml(htmlContent)
      setError("")
    } catch (err) {
      console.error("Preview error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate preview")
      setIframeHtml("")
    }
  }, [code])

  return (
    <div className="w-full h-full overflow-hidden bg-slate-900">
      {isGenerating ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader size={32} className="text-red-500 animate-spin mx-auto mb-3" />
            <p className="text-slate-400">Generating your page...</p>
          </div>
        </div>
      ) : error ? (
        <div className="p-8">
          <div className="bg-red-950/30 border border-red-800 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-red-400 mb-2">Preview Error</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : iframeHtml ? (
        <iframe
          srcDoc={iframeHtml}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-slate-400 text-lg">No page generated yet</p>
            <p className="text-slate-500 text-sm mt-1">Enter a prompt and click Generate to see a preview</p>
          </div>
        </div>
      )}
    </div>
  )
}
