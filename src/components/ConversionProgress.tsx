"use client"

import { CheckCircle, Music, Loader2, Download, X, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/Card"
import { Button } from "@/components/Button"
import { Playlist } from "@/app/page"

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
  playlistInfo?: Playlist
  onCancel?: () => void
}

export function ConversionProgress({
  isVisible,
  totalFiles,
  convertedFiles,
  onClose,
  isCompleted,
  playlistInfo,
  onCancel,
}: ConversionProgressProps) {
  if (!isVisible) return null

  const progress = totalFiles > 0 ? (convertedFiles.length / totalFiles) * 100 : 0
  const remaining = totalFiles - convertedFiles.length

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-slate-200 shadow-lg">
        <CardContent className="p-0">
          <div className="bg-slate-50 p-4 sm:p-6 border-b border-slate-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  {playlistInfo?.thumbnail && (
                    <div className="relative aspect-video w-16 sm:w-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <Image
                        src={playlistInfo.thumbnail.url}
                        fill
                        alt="Miniatura de la playlist en Setube"
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-[10px] px-1 py-0.5 rounded-tl">
                        {totalFiles} videos
                      </div>
                    </div>
                  )}
                  
                  {!playlistInfo?.thumbnail && (
                    <div className="bg-purple-100 p-2 rounded-lg">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" role="img" aria-label="Conversión completada" />
                      ) : (
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-purple-700" role="img" aria-label="Convirtiendo playlist" />
                      )}
                    </div>
                  )}

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                        {isCompleted ? "Conversión Completada" : playlistInfo?.title || "Convirtiendo Playlist"}
                      </h2>
                      <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded flex-shrink-0 whitespace-nowrap">
                        Playlist
                      </span>
                    </div>
                    <div className="space-y-1">
                      {playlistInfo?.description && (
                        <p className="text-slate-700 text-xs sm:text-sm line-clamp-1">{playlistInfo.description}</p>
                      )}
                      <p className="text-slate-600 text-xs sm:text-sm">
                        {isCompleted
                          ? "Todos los archivos han sido procesados"
                          : `${convertedFiles.length} de ${totalFiles} archivos convertidos`}
                      </p>
                    </div>
                  </div>
                </div>
                <Button onClick={onClose} variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-200/80">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>

              <div className="space-y-3 sm:space-y-4 mt-1">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-slate-700 font-medium">Progreso</span>
                  <span className="text-purple-700 font-semibold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 sm:h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-slate-100 rounded-lg p-2 sm:p-3 mt-1 border border-slate-200">
                  <div className="text-center p-1 sm:p-2 bg-white rounded shadow-sm">
                    <div className="text-base sm:text-xl font-bold text-emerald-600">{convertedFiles.length}</div>
                    <div className="text-slate-600 text-xs">Convertidos</div>
                  </div>
                  <div className="text-center p-1 sm:p-2 bg-white rounded shadow-sm">
                    <div className="text-base sm:text-xl font-bold text-amber-600">{remaining}</div>
                    <div className="text-slate-600 text-xs">Restantes</div>
                  </div>
                  <div className="text-center p-1 sm:p-2 bg-white rounded shadow-sm">
                    <div className="text-base sm:text-xl font-bold text-purple-600">{totalFiles}</div>
                    <div className="text-slate-600 text-xs">Total</div>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2 sm:gap-3 mt-1">
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="text-slate-700 hover:bg-slate-200 border border-slate-200"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Cerrar</span>
                  </Button>
                  
                  {!isCompleted && onCancel && (
                    <Button
                      onClick={onCancel}
                      variant="danger"
                      size="sm"
                      className="text-white bg-red-500 hover:bg-red-600"
                    >
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">Cancelar conversión</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-6 max-h-64 sm:max-h-96 overflow-y-auto bg-slate-50 border-t border-slate-100">
            <div className="space-y-2 sm:space-y-3">
              {convertedFiles.length === 0 && !isCompleted ? (
                <div className="text-center py-6 sm:py-8 text-slate-500">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-2 text-purple-500" />
                  <p className="text-sm font-medium">Iniciando conversión...</p>
                </div>
              ) : (
                <>
                  {convertedFiles.map((file, index) => (
                    <div
                      key={`${file.filename}-${file.timestamp}`}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white border border-slate-200 rounded-lg shadow-sm animate-in slide-in-from-left duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="p-1.5 sm:p-2 bg-emerald-100 rounded-lg flex-shrink-0">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" role="img" aria-label="Archivo convertido exitosamente" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{file.filename}</p>
                        <p className="text-xs text-slate-500">
                          Convertido • {new Date(file.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="p-1 bg-purple-100 rounded-full flex-shrink-0">
                        <Music className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-700" role="img" aria-label="Archivo de audio" />
                      </div>
                    </div>
                  ))}

                  {!isCompleted &&
                    remaining > 0 &&
                    Array.from({ length: Math.min(3, remaining) }).map((_, index) => (
                      <div
                        key={`pending-${index}`}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white border border-slate-200 rounded-lg shadow-sm animate-pulse"
                      >
                        <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg flex-shrink-0">
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 animate-spin" role="img" aria-label="Esperando para convertir" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-slate-600 font-medium">Esperando conversión...</p>
                          <p className="text-xs text-slate-500">En cola</p>
                        </div>
                      </div>
                    ))}

                  {remaining > 3 && (
                    <div className="text-center py-2 bg-slate-100 rounded-lg border border-slate-200">
                      <p className="text-xs sm:text-sm text-slate-600">y {remaining - 3} archivos más en cola...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {isCompleted && (
            <div className="p-3 sm:p-6 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 p-2 sm:p-3 rounded-lg border border-emerald-100">
                <Download className="w-4 h-4 sm:w-5 sm:h-5" role="img" aria-label="Descarga completada" />
                <span className="font-medium text-xs sm:text-sm">¡Descarga iniciada automáticamente!</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}