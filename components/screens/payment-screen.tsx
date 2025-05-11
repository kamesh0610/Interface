"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function PaymentScreen() {
  const router = useRouter()
  const [totalCost, setTotalCost] = useState(0)
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  useEffect(() => {
    // Get total cost from sessionStorage
    const cost = sessionStorage.getItem("totalCost")

    if (!cost) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No payment information found. Please select your prescription first.",
      })
      router.push("/")
      return
    }

    setTotalCost(Number.parseFloat(cost))
  }, [router])

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    const value = e.target.value.replace(/\s/g, "")
    if (/^\d*$/.test(value) && value.length <= 16) {
      const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
      setCardNumber(formatted)
    }
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      let formatted = value
      if (value.length > 2) {
        formatted = value.slice(0, 2) + "/" + value.slice(2)
      }
      setExpiryDate(formatted)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow 3 or 4 digits for CVV
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        variant: "destructive",
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number.",
      })
      return
    }

    if (!cardName.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Please enter the cardholder name.",
      })
      return
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast({
        variant: "destructive",
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date (MM/YY).",
      })
      return
    }

    if (cvv.length < 3) {
      toast({
        variant: "destructive",
        title: "Invalid CVV",
        description: "Please enter a valid CVV code.",
      })
      return
    }

    // Process payment (simulated)
    setPaymentStatus("processing")
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")

      // Navigate to dispensing screen after successful payment
      setTimeout(() => {
        router.push("/dispensing")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-800 text-white px-4 py-8 relative">
      <Toaster />

      <div className="absolute top-4 left-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/prescription")}
          className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          disabled={isProcessing}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Payment</h1>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total Amount:</span>
              <span className="text-2xl font-bold text-cyan-300">₹{totalCost.toFixed(2)}</span>
            </div>

            <div className="h-px bg-white/20 my-4"></div>

            {paymentStatus === "processing" ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin h-10 w-10 border-4 border-cyan-300 border-t-transparent rounded-full mb-4"></div>
                <p className="text-center">Processing payment...</p>
              </div>
            ) : paymentStatus === "success" ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
                <p className="text-xl font-medium text-center mb-2">Payment Successful!</p>
                <p className="text-center text-white/70">Redirecting to dispenser...</p>
              </div>
            ) : paymentStatus === "error" ? (
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
                <p className="text-xl font-medium text-center mb-2">Payment Failed</p>
                <p className="text-center text-white/70 mb-4">Please try again</p>
                <Button onClick={() => setPaymentStatus("idle")} className="bg-white/20 hover:bg-white/30">
                  Try Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="bg-white/20 border-white/30 pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="bg-white/20 border-white/30 h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className="bg-white/20 border-white/30 h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="bg-white/20 border-white/30 h-12"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 h-12 mt-6"
                >
                  Pay Now
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
