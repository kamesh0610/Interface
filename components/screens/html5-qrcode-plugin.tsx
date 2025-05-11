"use client"

import { useEffect, useRef, useState } from "react"

interface Html5QrcodePluginProps {
  fps?: number
  qrbox?: number | { width: number; height: number }
  disableFlip?: boolean
  qrCodeSuccessCallback: (decodedText: string, decodedResult?: any) => void
  qrCodeErrorCallback?: (errorMessage: string) => void
}

const Html5QrcodePlugin = ({
  fps = 10,
  qrbox = 250,
  disableFlip = false,
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
}: Html5QrcodePluginProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const html5QrCodeScannerRef = useRef<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const loadScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode")

        if (!containerRef.current || containerRef.current.clientWidth === 0) {
          console.warn("Scanner container is not yet visible or has no width.")
          return
        }

        const qrCodeScannerId = "qr-code-scanner-" + Date.now()
        const scannerElement = document.createElement("div")
        scannerElement.id = qrCodeScannerId

        containerRef.current.innerHTML = ""
        containerRef.current.appendChild(scannerElement)

        const html5QrCode = new Html5Qrcode(qrCodeScannerId)
        html5QrCodeScannerRef.current = html5QrCode

        const qrboxSize =
          typeof qrbox === "number" ? { width: qrbox, height: qrbox } : qrbox

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps,
            qrbox: qrboxSize,
            aspectRatio: 1.0,
            disableFlip,
          },
          (decodedText: string, decodedResult: any) => {
            qrCodeSuccessCallback(decodedText, decodedResult)
          },
          (errorMessage: string) => {
            if (
              !errorMessage.includes(
                "No MultiFormat Readers were able to detect the code"
              ) &&
              qrCodeErrorCallback
            ) {
              qrCodeErrorCallback(errorMessage)
            }
          }
        )
      } catch (err) {
        console.error("Failed to start scanner:", err)
        qrCodeErrorCallback?.(`Scanner failed to start: ${err}`)
      }
    }

    // Ensure DOM is ready and container has size before starting
    const checkAndStart = () => {
      if (containerRef.current && containerRef.current.clientWidth > 0) {
        loadScanner()
      } else {
        setTimeout(checkAndStart, 100) // Wait and check again
      }
    }

    checkAndStart()

    return () => {
      if (html5QrCodeScannerRef.current) {
        html5QrCodeScannerRef.current
          .stop()
          .then(() => html5QrCodeScannerRef.current.clear())
          .catch((err: any) =>
            console.error("Failed to stop scanner on cleanup:", err)
          )
      }
    }
  }, [isMounted, fps, qrbox, disableFlip, qrCodeSuccessCallback, qrCodeErrorCallback])

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "300px",
        minHeight: "300px",
        backgroundColor: "#000",
      }}
    />
  )
}

export default Html5QrcodePlugin
