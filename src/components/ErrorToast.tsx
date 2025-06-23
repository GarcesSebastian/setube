"use client"

import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/Button"

interface ErrorToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white border border-red-200 rounded-xl shadow-lg p-4 max-w-md">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">Error</h3>
            <p className="text-sm text-red-600">{message}</p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm" className="p-1 h-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
