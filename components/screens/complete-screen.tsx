"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"
import confetti from "canvas-confetti"

export default function CompleteScreen() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [floatingPills, setFloatingPills] = useState<
    {
      width: number
      height: number
      top: string
      left: string
      animationDuration: number
      animationDelay: number
      opacity: number
      rotation: number
    }[]
  >([])

  useEffect(() => {
    // Run on client only
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Generate random values for animated pills
    const pills = Array.from({ length: 12 }, () => ({
      width: Math.random() * 30 + 10,
      height: Math.random() * 15 + 5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: Math.random() * 10 + 10,
      animationDelay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * 360,
    }))
    setFloatingPills(pills)

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/")
    }
  }, [countdown, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-md w-full text-center">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
          <CheckCircle className="h-20 w-20 text-green-400 mx-auto relative z-10" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Pills Dispensed!</h1>
        <p className="text-xl mb-6">Please collect your medication</p>

        <div className="p-4 bg-white/10 rounded-xl mb-6">
          <p className="text-white/70">
            Thank you for using our Pill Dispenser. Remember to take your medication as prescribed.
          </p>
        </div>

        <p className="text-sm text-white/60">
          Returning to home screen in <span className="font-bold text-white">{countdown}</span> seconds
        </p>
      </div>

      {/* Animated pills floating — hydrated after mount */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingPills.map((pill, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/30 backdrop-blur-sm"
            style={{
              width: `${pill.width}px`,
              height: `${pill.height}px`,
              top: pill.top,
              left: pill.left,
              animation: `float ${pill.animationDuration}s linear infinite`,
              animationDelay: `${pill.animationDelay}s`,
              opacity: pill.opacity,
              transform: `rotate(${pill.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Pulsing background effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-green-600/20 animate-pulse-slow" />
      </div>
    </div>
  )
}
