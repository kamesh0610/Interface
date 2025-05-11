"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Pill } from "lucide-react"

export default function DispensingScreen() {
  const router = useRouter()
  const [dispensingComplete, setDispensingComplete] = useState(false)
  const [pillsDispensed, setPillsDispensed] = useState<number[]>([])
  const [totalPills, setTotalPills] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Get prescription data from sessionStorage
    const storedPrescription = sessionStorage.getItem("prescription")

    if (!storedPrescription) {
      router.push("/")
      return
    }

    try {
      const prescription = JSON.parse(storedPrescription)
      const totalCount = prescription.medicines.reduce((sum: number, med: any) => sum + med.noOfTablets, 0)
      setTotalPills(totalCount)

      // Start dispensing animation
      let dispensed = 0
      const interval = setInterval(() => {
        if (dispensed < totalCount) {
          dispensed++
          setPillsDispensed((prev) => [...prev, Math.random()])
          setProgress((dispensed / totalCount) * 100)
        } else {
          clearInterval(interval)
          setDispensingComplete(true)

          // Navigate to completion screen after dispensing is complete
          setTimeout(() => {
            router.push("/complete")
          }, 2000)
        }
      }, 500)

      return () => clearInterval(interval)
    } catch (error) {
      console.error("Error parsing prescription:", error)
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-md w-full text-center">
        <Pill className="h-16 w-16 text-cyan-300 mx-auto mb-6" />

        <h1 className="text-3xl font-bold mb-6">
          {dispensingComplete ? "Dispensing Complete!" : "Dispensing Pills..."}
        </h1>

        <div className="w-full bg-white/10 rounded-full h-4 mb-6 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-lg mb-2">
          {dispensingComplete
            ? `All ${totalPills} pills dispensed`
            : `Dispensing ${pillsDispensed.length} of ${totalPills} pills`}
        </p>

        <p className="text-white/70">
          {dispensingComplete
            ? "Please collect your medication"
            : "Please wait while your medication is being prepared"}
        </p>
      </div>

      {/* Animated pills falling */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pillsDispensed.map((id, index) => (
          <div
            key={index}
            className="absolute w-6 h-3 bg-white rounded-full"
            style={{
              left: `${(id * 80) % 100}%`,
              top: `${((index * 10) % 100) - 10}%`,
              opacity: Math.max(0, 1 - index * 0.02),
              animation: `fall 1.5s linear forwards`,
              animationDelay: `${index * 0.1}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Add a subtle pulsing circle behind the main content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-600/20 animate-pulse-slow" />
      </div>
    </div>
  )
}
