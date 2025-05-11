"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Calendar, Phone, Pill, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Medicine {
  name: string
  routine: string[]
  timing: string
  noOfTablets: number
}

interface Prescription {
  patientName: string
  patientAge: number
  phoneNumber: string
  medicines: Medicine[]
  codeId: string
}

export default function PrescriptionScreen() {
  const router = useRouter()
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get prescription data from sessionStorage
    const storedPrescription = sessionStorage.getItem("prescription")

    if (!storedPrescription) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No prescription data found. Please scan a QR code or enter a code ID.",
      })
      router.push("/")
      return
    }

    try {
      const parsedPrescription = JSON.parse(storedPrescription) as Prescription
      setPrescription(parsedPrescription)
      setMedicines([...parsedPrescription.medicines])
    } catch (error) {
      console.error("Error parsing prescription:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid prescription data. Please try again.",
      })
      router.push("/")
    }
  }, [router])

  const handleRemoveMedicine = (index: number) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDecreaseQuantity = (index: number) => {
    setMedicines((prev) =>
      prev.map((med, i) => {
        if (i === index && med.noOfTablets > 1) {
          return { ...med, noOfTablets: med.noOfTablets - 1 }
        }
        return med
      }),
    )
  }

  const handleProceed = () => {
    // Save modified medicines to sessionStorage
    if (prescription) {
      const updatedPrescription = { ...prescription, medicines }
      sessionStorage.setItem("prescription", JSON.stringify(updatedPrescription))

      // Calculate total cost (simple calculation for demo)
      const totalCost = medicines.reduce((sum, med) => sum + med.noOfTablets * 5, 0)
      sessionStorage.setItem("totalCost", totalCost.toString())

      // Navigate to payment screen
      router.push("/payment")
    }
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 flex items-center justify-center">
        <div className="p-8 rounded-xl bg-white/10 backdrop-blur-md">
          <div className="animate-spin h-8 w-8 border-4 border-cyan-300 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-white">Loading prescription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 text-white px-4 py-8 relative">
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

      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Prescription Details</h1>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

            <div className="space-y-3">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-cyan-300" />
                <span className="text-white/80 mr-2">Name:</span>
                <span className="font-medium">{prescription.patientName}</span>
              </div>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-cyan-300" />
                <span className="text-white/80 mr-2">Age:</span>
                <span className="font-medium">{prescription.patientAge} years</span>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-cyan-300" />
                <span className="text-white/80 mr-2">Phone:</span>
                <span className="font-medium">{prescription.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Medicines</h2>

        {medicines.length === 0 ? (
          <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl mb-6">
            <CardContent className="p-6 text-center text-white/70">
              <p>No medicines selected</p>
            </CardContent>
          </Card>
        ) : (
          medicines.map((medicine, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl mb-4">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Pill className="h-5 w-5 mr-2 text-cyan-300" />
                      <span className="font-medium">{medicine.name}</span>
                    </div>

                    <div className="text-sm text-white/70">
                      <p>Routine: {medicine.routine.join(", ")}</p>
                      <p>Timing: {medicine.timing}</p>
                    </div>

                    <div className="flex items-center mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecreaseQuantity(index)}
                        className="h-8 w-8 rounded-full bg-white/10 border-white/30"
                        disabled={medicine.noOfTablets <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="mx-3 font-medium">{medicine.noOfTablets}</span>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/10 border-white/30 opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMedicine(index)}
                    className="text-red-300 hover:text-red-200 hover:bg-red-900/20"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        <div className="mt-8">
          <Button
            onClick={handleProceed}
            disabled={medicines.length === 0 || isLoading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-14 text-lg font-medium rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center">
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center">
                Proceed to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
