"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Loader2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import dynamic from "next/dynamic"

// Import the HTML5 QR code scanner which is more reliable
const Html5QrcodePlugin = dynamic(() => import("./html5-qrcode-plugin"), {
  ssr: false,
})

// API endpoint configuration - can be changed based on environment
const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "https://hardware-backend-psi.vercel.app/get-prescriptions"

// Mock prescription data for preview/development

export default function QrScannerScreen() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)
  const [manualCodeId, setManualCodeId] = useState("")
  const [showManualInput, setShowManualInput] = useState(false)
  const [scannerReady, setScannerReady] = useState(false)
  const [scanning, setScanning] = useState(false)
  

  useEffect(() => {
    // Check if we're in preview mode
    
    // Check camera permission on component mount
    checkCameraPermission()
  }, [])

  
  

  const checkCameraPermission = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        // Stop the stream immediately after getting permission
        stream.getTracks().forEach((track) => track.stop())
        setCameraPermission(true)
        setScannerReady(true)
        setScanning(true)
        console.log("Camera permission granted")
      } else {
        console.warn("MediaDevices API not available")
        setCameraPermission(false)
      }
    } catch (err) {
      console.error("Camera permission error:", err)
      setCameraPermission(false)
    }
  }

  const processPrescription = async (codeId: string) => {
    try {
      // If in preview mode, use mock data
      

      // Otherwise, make the actual API call
      console.log("Making API request to:", `http://localhost:5000/get-prescription`)
      const response = await fetch(`http://localhost:5000/get-prescription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId: codeId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Invalid QR code")
      }

      const prescriptionData = await response.json()
      sessionStorage.setItem("prescription", JSON.stringify(prescriptionData))
      return true
    } catch (error) {
      console.error("Error processing prescription:", error)
      throw error
    }
  }

  const handleQrCodeScan = async (decodedText: string) => {
    if (isLoading || !scanning) return

    try {
      console.log("QR code scanned:", decodedText)
      setScanning(false)
      let codeId = decodedText

      // Try to parse JSON if the QR code contains JSON data
      if (typeof decodedText === "string" && decodedText.includes("{")) {
        try {
          const parsedData = JSON.parse(decodedText)
          codeId = parsedData.codeId || parsedData.patientId || parsedData
        } catch (e) {
          console.log("QR data is not valid JSON:", decodedText)
        }
      }

      codeId = String(codeId)
      console.log("Extracted code ID:", codeId)

      setIsLoading(true)

      // Show a toast to indicate scanning was successful
      toast({
        title: "QR Code Detected",
        description: "Processing code...",
        duration: 2000,
      })

      // Process the prescription
      await processPrescription(codeId)

      // Navigate to prescription page
      router.push("/prescription")
    } catch (error) {
      console.error("Error processing QR code:", error)

      let errorMessage = "Failed to process QR code"

      
      

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })

      setIsLoading(false)
      setScanning(true)
    }
  }

  const handleScannerError = (error: string) => {
    console.error("Scanner error:", error)

    // Only show toast for non-permission errors since permission is handled separately
    if (!error.includes("permission") && !error.includes("MultiFormat Readers")) {
      toast({
        variant: "destructive",
        title: "Scanner Error",
        description: error || "Failed to initialize scanner",
      })
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!manualCodeId.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a code ID",
      })
      return
    }

    setIsLoading(true)

    try {
      // Process the prescription
      await processPrescription(manualCodeId)

      // Navigate to prescription page
      router.push("/prescription")
    } catch (error) {
      console.error("Error:", error)

      let errorMessage = "Failed to process code"

      

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })

      setIsLoading(false)
    }
  }

  // Calculate responsive QR box size based on screen width
  const getQrBoxSize = () => {
    if (typeof window !== "undefined") {
      const width = Math.min(window.innerWidth - 80, 300)
      return { width, height: width }
    }
    return { width: 250, height: 250 }
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
          {showManualInput ? (
            <QrCode className="h-16 w-16 text-cyan-300" />
          ) : (
            <Camera className="h-16 w-16 text-cyan-300" />
          )}
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">{showManualInput ? "Enter Code ID" : "QR Scanner"}</h1>

        <div className="space-y-6">
          {showManualInput ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter code ID"
                value={manualCodeId}
                onChange={(e) => setManualCodeId(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60 h-14 text-lg"
              />

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

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowManualInput(false)}
                className="w-full text-white/70 hover:text-white hover:bg-white/10"
              >
                Try Scanner Again
              </Button>
            </form>
          ) : (
            <>
              {cameraPermission === false ? (
                <div className="text-center p-6 bg-white/5 rounded-xl">
                  <p className="text-amber-300 mb-4">Camera Permission Denied</p>
                  <p className="text-sm text-white/70 mb-4">
                    Unable to access your camera. Please allow permission or enter code manually.
                  </p>
                  <Button
                    onClick={() => setShowManualInput(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    Enter Code Manually
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4 rounded-xl overflow-hidden border-2 border-cyan-400 relative">
                    {scannerReady && (
                      <>
                        <Html5QrcodePlugin
                          fps={15}
                          qrbox={getQrBoxSize()}
                          disableFlip={false}
                          qrCodeSuccessCallback={handleQrCodeScan}
                          qrCodeErrorCallback={handleScannerError}
                        />
                        {/* Scanning overlay with animation */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                          <div className="absolute inset-0 border-4 border-cyan-400 opacity-50 rounded-lg"></div>
                          <div className="w-full h-1 bg-cyan-400 absolute top-1/2 animate-pulse"></div>
                          <p className="text-white bg-black/50 px-3 py-1 rounded-full text-sm mt-4 animate-pulse">
                            Position QR code in frame
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => setShowManualInput(true)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                    >
                      Enter Code Manually
                    </Button>
                    <Button
                      onClick={() => {
                        setScanning(true)
                        toast({
                          title: "Scanner Reset",
                          description: "Try scanning again",
                          duration: 2000,
                        })
                      }}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                      disabled={!scannerReady || isLoading}
                    >
                      Reset Scanner
                    </Button>
                  </div>
                </>
              )}
              <p className="text-center text-sm text-white/70 mt-2">
                Make sure your QR code is well-lit and clearly visible
              </p>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-600/20 animate-pulse-slow" />
      </div>

      
    </div>
  )
}
