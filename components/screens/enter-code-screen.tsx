"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, KeySquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function EnterCodeScreen() {
  const router = useRouter()
  const [codeId, setCodeId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
 

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!codeId.trim()) {
      setError("Please enter a code ID")
      return
    }

    setIsLoading(true)

    try {
      console.log("Sending patientId:", codeId)
      sessionStorage.setItem("patientId", codeId)

    // Navigate to payment
    // router.push("/pay")
      const response = await fetch("https://aaef-2409-40f4-4115-f95b-9c07-16e5-33f2-eee9.ngrok-free.app/get-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId: codeId }),
        
      })

      if (!response.ok) {
        setError("Prescription not found for this patient ID.");
      }
      else{

      const data = await response.json()

      // Store prescription data in sessionStorage
      sessionStorage.setItem("prescription", JSON.stringify(data))

      // Navigate to prescription screen
      router.push("/prescription")
      }

    } catch (error) {
      console.error("Error:", error)
      const message = error instanceof Error ? error.message : "An error occurred"
      // setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 flex flex-col items-center justify-center text-white px-4 relative">
      <Toaster />

      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <KeySquare className="h-16 w-16 text-cyan-300" />
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Enter Code ID</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your code ID"
              value={codeId}
              onChange={(e) => setCodeId(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-14 text-lg"
            />
            {error && <p className="text-red-300 text-sm">{error}</p>}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-14 text-lg font-medium rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>
      </div>

      {/* Add a subtle pulsing circle behind the main content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-600/20 animate-pulse-slow" />
      </div>
    </div>
  )
}
