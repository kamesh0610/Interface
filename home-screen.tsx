"use client"
import { useRouter } from "next/navigation"
import { Pill, QrCode, KeySquare } from "lucide-react"

const HomeScreen = () => {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
      {/* Decorative pills floating in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      {/* Content container with glass effect */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Pill className="h-16 w-16 text-cyan-300 animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300">
          Pill Dispenser
        </h1>

        <p className="text-center text-white/80 mb-8">Access your medication safely and easily</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/enter-code")}
            className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-lg font-medium py-4 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            <KeySquare className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Enter Code ID
          </button>

          <button
            onClick={() => router.push("/scan-qr")}
            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-medium py-4 px-6 rounded-xl shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center"
          >
            <QrCode className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Scan QR Code
          </button>
        </div>
      </div>

      {/* Add a subtle pulsing circle behind the main content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-purple-600/20 animate-pulse-slow" />
      </div>
    </div>
  )
}

export default HomeScreen
