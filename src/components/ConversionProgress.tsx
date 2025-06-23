"use client"

import { CheckCircle, Music, Loader2, Download, X } from "lucide-react"
import { Card, CardContent } from "@/components/Card"
import { Button } from "@/components/Button"

interface ConvertedFile {
  filename: string
  timestamp: number
}

interface ConversionProgressProps {
  isVisible: boolean
  totalFiles: number
  convertedFiles: ConvertedFile[]
  onClose: () => void
  isCompleted: boolean
}

export function ConversionProgress({
  isVisible,
  totalFiles,
  convertedFiles,
  onClose,
  isCompleted,
}: ConversionProgressProps) {
  if (!isVisible) return null

  const progress = totalFiles > 0 ? (convertedFiles.length / totalFiles) * 100 : 0
  const remaining = totalFiles - convertedFiles.length

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Loader2 className="w-6 h-6 animate-spin" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {isCompleted ? "Conversión Completada" : "Convirtiendo Playlist"}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {isCompleted
                        ? "Todos los archivos han sido procesados"
                        : `${convertedFiles.length} de ${totalFiles} archivos convertidos`}
                    </p>
                  </div>
                </div>
                <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{convertedFiles.length}</div>
                  <div className="text-white/80 text-xs">Convertidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{remaining}</div>
                  <div className="text-white/80 text-xs">Restantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalFiles}</div>
                  <div className="text-white/80 text-xs">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="p-6 max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {convertedFiles.length === 0 && !isCompleted ? (
                <div className="text-center py-8 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>Iniciando conversión...</p>
                </div>
              ) : (
                <>
                  {/* Converted Files */}
                  {convertedFiles.map((file, index) => (
                    <div
                      key={`${file.filename}-${file.timestamp}`}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-left duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">{file.filename}</p>
                        <p className="text-xs text-green-600">
                          Convertido • {new Date(file.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="p-1 bg-green-200 rounded-full">
                        <Music className="w-3 h-3 text-green-700" />
                      </div>
                    </div>
                  ))}

                  {/* Remaining Files (only show a few) */}
                  {!isCompleted &&
                    remaining > 0 &&
                    Array.from({ length: Math.min(3, remaining) }).map((_, index) => (
                      <div
                        key={`pending-${index}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-50"
                      >
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Esperando conversión...</p>
                          <p className="text-xs text-gray-500">En cola</p>
                        </div>
                      </div>
                    ))}

                  {remaining > 3 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-gray-500">y {remaining - 3} archivos más...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          {isCompleted && (
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <Download className="w-5 h-5" />
                <span className="font-medium">¡Descarga iniciada automáticamente!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
