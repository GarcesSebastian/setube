import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Setube - Convertidor YouTube Gratuito",
    template: "%s | Setube"
  },
  description: "Convierte videos y playlists de YouTube a MP3, WAV y M4A en segundos. Gratis, rápido y sin límites.",
  keywords: "setube, descargar youtube, convertidor youtube, youtube a mp3, descargar musica youtube, youtube to mp3, descargar videos youtube, convertidor gratuito, convertir youtube a mp3, playlist youtube a mp3",
  authors: [{ name: "Setube" }],
  creator: "Setube",
  publisher: "Setube",
  robots: "index, follow",
  openGraph: {
    title: "Setube - Convertidor YouTube Gratuito",
    description: "Convierte videos y playlists de YouTube a MP3, WAV y M4A en segundos. Gratis, rápido y sin límites.",
    url: "https://setube.com",
    siteName: "Setube",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://setube.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Setube - Convertidor YouTube a MP3"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Setube - Convertidor YouTube Gratuito",
    description: "Convierte videos y playlists de YouTube a MP3, WAV y M4A en segundos. Gratis, rápido y sin límites.",
    images: ["https://setube.com/twitter-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="canonical" href="https://setube.com" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
