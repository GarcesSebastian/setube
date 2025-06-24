"use client"

import type React from "react"

import { Music, Headphones, Radio } from "lucide-react"

type Format = "mp3" | "wav" | "m4a"

interface FormatOption {
  value: Format
  label: string
  icon: React.ReactNode
  compatibility: number
  quality: number
  size: number
  color: string
}

interface FormatSelectorProps {
  value: Format
  onChange: (format: Format) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const formats: FormatOption[] = [
    {
      value: "mp3",
      label: "MP3",
      icon: <Music className="w-4 h-4 sm:w-5 sm:h-5" />,
      compatibility: 100,
      quality: 80,
      size: 60,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "wav",
      label: "WAV",
      icon: <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />,
      compatibility: 70,
      quality: 100,
      size: 100,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "m4a",
      label: "M4A",
      icon: <Radio className="w-4 h-4 sm:w-5 sm:h-5" />,
      compatibility: 85,
      quality: 90,
      size: 70,
      color: "from-purple-500 to-violet-500",
    },
  ]

  const CompatibilityBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className={`bg-gradient-to-r ${color} h-1.5 rounded-full transition-all duration-500`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {formats.map((format) => (
          <button
            key={format.value}
            onClick={() => onChange(format.value)}
            className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
              value === format.value
                ? "border-slate-400 bg-slate-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${format.color} text-white`}>{format.icon}</div>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm">{format.label}</span>
            </div>

            {value === format.value && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-600 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs">
          <div className="text-center">
            <div className="text-gray-600 mb-1 text-xs">Compatibilidad</div>
            <CompatibilityBar
              percentage={formats.find((f) => f.value === value)?.compatibility || 0}
              color={formats.find((f) => f.value === value)?.color || "from-gray-400 to-gray-500"}
            />
          </div>
          <div className="text-center">
            <div className="text-gray-600 mb-1 text-xs">Calidad</div>
            <CompatibilityBar
              percentage={formats.find((f) => f.value === value)?.quality || 0}
              color={formats.find((f) => f.value === value)?.color || "from-gray-400 to-gray-500"}
            />
          </div>
          <div className="text-center">
            <div className="text-gray-600 mb-1 text-xs">Tamaño</div>
            <CompatibilityBar
              percentage={formats.find((f) => f.value === value)?.size || 0}
              color={formats.find((f) => f.value === value)?.color || "from-gray-400 to-gray-500"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
