"use client"

import { useState } from "react"
import { toast } from "sonner"
import Navigation from "@/components/navigation"
import Sidebar from "@/components/sidebar"
import MainWorkspace from "@/components/main-workspace"
import { generateComponentCode, APIError } from "@/lib/api-client"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [generatedCode, setGeneratedCode] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string>("")

  const handleGenerate = async () => {
    // Validate input
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)
    setError("")

    try {
      console.log("prompt",prompt)
      const response = await generateComponentCode(prompt)

      if (response.error) {
        setError(response.error)
        toast.error(`Error: ${response.error}`)
        setGeneratedCode("")
      } else {
        setGeneratedCode(response.code)
        setActiveTab("code")
        toast.success("Component generated successfully!")

        // Show warnings if any
        if (response.warnings && response.warnings.length > 0) {
          toast.warning(
            `Generated with warnings: ${response.warnings.join(", ")}`
          )
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof APIError ? err.message : "Failed to generate code"
      setError(errorMessage)
      toast.error(errorMessage)
      setGeneratedCode("")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-50">
      <Navigation />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainWorkspace
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          generatedCode={generatedCode}
        />
      </div>
    </div>
  )
}
