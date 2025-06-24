"use client"

import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/Card"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { FormatSelector } from "@/components/FormatSelector"
import { ModeToggle } from "@/components/ModeToggle"
import { ErrorToast } from "@/components/ErrorToast"
import { ConversionProgress } from "@/components/ConversionProgress"
import {
  Download,
  Plus,
  Trash2,
  Youtube,
  Loader2,
  CheckCircle,
  Info,
  Sparkles,
  Search,
  Music,
  Eye,
} from "lucide-react"

interface URL {
  url: string
  id: string
}

export interface Playlist {
  id: string,
  thumbnail: {
    url: string,
    width: number,
    height: number
  },
  url: string,
  title: string,
  description: string,
  total_items: number,
  views: number,
}

export interface PlaylistInfo {
  info: Playlist,
  total: number
  urls: string[]
}

interface ConvertedFile {
  filename: string
  timestamp: number
}

type Format = "mp3" | "wav" | "m4a"
type ConversionMode = "urls" | "playlist"

export default function YouTubeConverter() {
  const [urls, setUrls] = useState<URL[]>([
    {
      url: "https://www.youtube.com/watch?v=1G4isv_Fylg&list=RDd_HlPboLRL8&index=4",
      id: uuidv4(),
    },
  ])
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [format, setFormat] = useState<Format>("mp3")
  const [mode, setMode] = useState<ConversionMode>("urls")
  const [isConverting, setIsConverting] = useState(false)
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false)
  const [convertedCount, setConvertedCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const [showProgress, setShowProgress] = useState(false)
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([])
  const [totalFilesToConvert, setTotalFilesToConvert] = useState(0)
  const [isConversionCompleted, setIsConversionCompleted] = useState(false)

  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (mode === "playlist" && playlistUrl.trim()) {
      const timer = setTimeout(() => {
        fetchPlaylistInfo()
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setPlaylistInfo(null)
    }
  }, [playlistUrl, mode])

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

  const showError = (message: string) => {
    setError(message)
    setIsConverting(false)
    setIsLoadingPlaylist(false)
    closeEventSource()
  }

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }

  const setupEventSource = () => {
    try {
      closeEventSource()

      const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/events`)
      eventSourceRef.current = eventSource

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log("SSE Data:", data)

          if (data.type === "success" && data.filename) {
            setConvertedFiles((prev) => [
              ...prev,
              {
                filename: data.filename,
                timestamp: Date.now(),
              },
            ])
          }
        } catch (parseError) {
          console.error("Error parsing SSE data:", parseError)
        }
      }

      eventSource.onerror = (error) => {
        console.error("Error en EventSource:", error)
        setTimeout(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            showError("Se perdió la conexión con el servidor durante la conversión")
          }
        }, 3000)
      }

      eventSource.onopen = () => {
        console.log("EventSource connection opened")
      }
    } catch (error) {
      console.error("Error setting up EventSource:", error)
      showError("No se pudo establecer conexión en tiempo real con el servidor")
    }
  }

  const fetchPlaylistInfo = async () => {
    if (!playlistUrl.trim()) return

    setIsLoadingPlaylist(true)
    setPlaylistInfo(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/playlist-to-audio`, {
        method: "POST",
        body: JSON.stringify({ url: playlistUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data: PlaylistInfo = await response.json()
      setPlaylistInfo(data)
    } catch (error) {
      console.error("Error fetching playlist:", error)
      showError("No se pudo obtener la información de la playlist. Verifica la URL.")
    } finally {
      setIsLoadingPlaylist(false)
    }
  }

  const handleConvert = async () => {
    setIsConverting(true)
    setConvertedCount(0)
    setConvertedFiles([])
    setIsConversionCompleted(false)

    try {
      let urlsToConvert: string[] = []

      if (mode === "playlist") {
        if (!playlistInfo || !playlistInfo.urls.length) {
          throw new Error("No hay información de playlist disponible")
        }
        urlsToConvert = playlistInfo.urls
        setTotalFilesToConvert(playlistInfo.total)
        setShowProgress(true)
        setupEventSource()
      } else {
        const validUrls = urls.filter((url) => url.url.trim()).map((url) => url.url)
        if (validUrls.length === 0) {
          throw new Error("Por favor ingresa al menos una URL válida")
        }
        urlsToConvert = validUrls
        setTotalFilesToConvert(validUrls.length)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert-to-audio`, {
        method: "POST",
        body: JSON.stringify({ urls: urlsToConvert, format }),
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error en la conversión: ${response.status} - ${errorText}`)
      }

      const defaultFilename = urlsToConvert.length > 1 ? `download.zip` : `download.${format}`

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const filename =
        response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || defaultFilename

      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setConvertedCount(urlsToConvert.length)
      setIsConversionCompleted(true)

      setTimeout(() => {
        closeEventSource()
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      showError(error instanceof Error ? error.message : "Error desconocido en la conversión")
    } finally {
      setIsConverting(false)
    }
  }

  const addNewUrl = () => {
    const newURL: URL = { url: "", id: uuidv4() }
    setUrls((prevUrls) => [...prevUrls, newURL])
  }

  const removeUrl = (id: string) => {
    if (urls.length > 1) {
      setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id))
    }
  }

  const handleUrlChange = (id: string, value: string) => {
    setUrls((prevUrls) => prevUrls.map((url) => (url.id === id ? { ...url, url: value } : url)))
  }

  const handleCloseProgress = () => {
    setShowProgress(false)
    closeEventSource()
    if (isConverting) {
      setIsConverting(false)
    }
  }

  const validUrls = urls.filter((url) => url.url.trim()).length
  const isPlaylistValid = playlistUrl.trim().length > 0
  const canConvert = mode === "urls" ? validUrls > 0 : playlistInfo && playlistInfo.urls.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-3xl">
        {error && <ErrorToast message={error} onClose={() => setError(null)} />}

        <ConversionProgress
          isVisible={showProgress}
          totalFiles={totalFilesToConvert}
          convertedFiles={convertedFiles}
          onClose={handleCloseProgress}
          isCompleted={isConversionCompleted}
          playlistInfo={playlistInfo?.info}
        />

        <div className="text-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top duration-1000">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="relative">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 p-0.5 sm:p-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            YouTube to Audio
          </h1>
          <p className="text-slate-600 text-sm sm:text-lg px-4">Convierte videos y playlists a audio de alta calidad</p>
        </div>

        <Card className="shadow-xl border-0 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Tipo de conversión</span>
              </div>
              <ModeToggle mode={mode} onChange={setMode} />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">Formato de salida</span>
              </div>
              <FormatSelector value={format} onChange={setFormat} />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700">
                  {mode === "playlist" ? "URL de Playlist" : "URLs de YouTube"}
                </span>
              </div>

              <div className="relative overflow-hidden">
                {mode === "urls" ? (
                  <div className="animate-in fade-in slide-in-from-right duration-500 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-end">
                      <Button onClick={addNewUrl} variant="ghost" size="sm">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden xs:inline">Agregar</span>
                        <span className="xs:hidden">+</span>
                      </Button>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      {urls.map((url, index) => (
                        <div
                          key={url.id}
                          className="flex gap-2 sm:gap-3 animate-in fade-in slide-in-from-left duration-500"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex-1 relative">
                            <Input
                              type="url"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={url.url}
                              onChange={(e) => handleUrlChange(url.id, e.target.value)}
                              className="pr-8 sm:pr-10"
                            />
                            {url.url.trim() && (
                              <CheckCircle className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            )}
                          </div>
                          {urls.length > 1 && (
                            <Button
                              onClick={() => removeUrl(url.id)}
                              variant="danger"
                              size="md"
                              className="px-2 sm:px-3"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {validUrls > 0 && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        {validUrls} archivo{validUrls > 1 ? "s" : ""} listo{validUrls > 1 ? "s" : ""}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-left duration-500 space-y-3 sm:space-y-4">
                    <div className="relative">
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/playlist?list=..."
                        value={playlistUrl}
                        onChange={(e) => setPlaylistUrl(e.target.value)}
                        className="pr-8 sm:pr-10"
                      />
                      {isLoadingPlaylist ? (
                        <Loader2 className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 animate-spin text-slate-500" />
                      ) : (
                        isPlaylistValid && (
                          <Search className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                        )
                      )}
                    </div>

                    {playlistInfo && (
                      <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 rounded-xl border border-purple-100">
                          <div className="flex flex-col items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                              <Image
                                src={playlistInfo.info.thumbnail.url}
                                width={playlistInfo.info.thumbnail.width}
                                height={playlistInfo.info.thumbnail.height}
                                alt="Miniatura de playlist de YouTube para convertir a MP3 con Setube, el mejor convertidor de YouTube a audio"
                                className="rounded-lg"
                              />
                            </div>
                            <div className="text-center">
                              <p className="text-xs sm:text-sm font-medium text-slate-700">Playlist Detectada</p>
                              <p className="text-sm text-slate-600 font-bold">{playlistInfo.info.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{playlistInfo.info.description}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2 sm:p-3">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Music className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">Total de videos:</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg font-bold text-purple-600">
                                  {playlistInfo.total}
                                </span>
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between bg-white/50 rounded-lg p-2 sm:p-3">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                <span className="text-xs sm:text-sm font-medium text-slate-700">Reproducciones:</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg font-bold text-purple-600">
                                  {new Intl.NumberFormat('es-ES').format(playlistInfo.info.views)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isLoadingPlaylist && (
                      <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 px-3 py-3 sm:py-4 rounded-lg animate-pulse">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        Obteniendo información de la playlist...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleConvert}
                disabled={isConverting || !canConvert || isLoadingPlaylist}
                className="w-full"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    <span className="text-xs sm:text-sm">
                      {mode === "playlist" ? "Convirtiendo playlist..." : "Convirtiendo..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-xs sm:text-sm">
                      {mode === "playlist"
                        ? `Convertir Playlist (${playlistInfo?.total || 0})`
                        : "Convertir y Descargar"}
                    </span>
                  </>
                )}
              </Button>

              {convertedCount > 0 && !isConverting && !showProgress && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 mt-3 animate-in fade-in duration-500">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">
                    ¡{convertedCount} archivo{convertedCount > 1 ? "s" : ""} convertido{convertedCount > 1 ? "s" : ""}!
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg animate-in fade-in slide-in-from-bottom duration-1000 delay-400">
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <span className="font-semibold text-slate-700 text-sm sm:text-base">Cómo funciona</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">Elige modo</p>
                  <p className="text-xs text-slate-600">URLs o playlist</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">Pega URL</p>
                  <p className="text-xs text-slate-600">De YouTube</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">Elige formato</p>
                  <p className="text-xs text-slate-600">MP3, WAV o M4A</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-50 to-red-50">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-700">Descarga</p>
                  <p className="text-xs text-slate-600">Tu archivo</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 sm:mt-8 text-slate-500 text-xs animate-in fade-in duration-1000 delay-600 px-4">
          <p>Respeta los derechos de autor • Usa solo contenido autorizado</p>
        </div>
      </div>
    </div>
  )
}
