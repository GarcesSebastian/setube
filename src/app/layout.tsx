import type { Metadata } from "next";
import "@/styles/globals.css";

import { BASE_URL } from "@/config";

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
    url: BASE_URL,
    siteName: "Setube",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
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
    images: [`${BASE_URL}/twitter-image.png`]
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
        <link rel="canonical" href={BASE_URL} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Setube: Convierte videos y playlists de YouTube a MP3, WAV y M4A gratis, rápido y sin límites. El mejor convertidor de YouTube a audio. Compatible con todas las plataformas. ¡Descarga música y audio de YouTube fácil y seguro!" />
        <meta name="keywords" content="setube, convertir youtube a mp3, convertir de youtube a audio, descargar youtube mp3, descargar audio youtube, youtube a mp3, youtube to mp3, convertidor gratuito, descargar música youtube, playlist youtube a mp3" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Setube - Convertidor YouTube a MP3, WAV y M4A Gratis" />
        <meta property="og:description" content="Convierte videos y playlists de YouTube a MP3, WAV y M4A en segundos. Gratis, rápido y sin límites." />
        <meta property="og:url" content={BASE_URL} />
        <meta property="og:site_name" content="Setube" />
        <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
        <meta property="og:image:alt" content="Setube: Convertidor de YouTube a MP3, WAV y M4A gratis, rápido y seguro. Descarga música y audio de YouTube fácilmente." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Setube - Convertidor YouTube a MP3, WAV y M4A Gratis" />
        <meta name="twitter:description" content="Convierte videos y playlists de YouTube a MP3, WAV y M4A en segundos. Gratis, rápido y sin límites." />
        <meta name="twitter:image" content={`${BASE_URL}/twitter-image.png`} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Setube",
              "url": "${BASE_URL}",
              "description": "Setube: Convertidor de YouTube a MP3, WAV y M4A gratis, rápido y sin límites. El mejor convertidor de YouTube a audio.",
              "alternateName": "Convertidor YouTube a MP3, YouTube a Audio, Descargar música de YouTube",
              "sameAs": [
                "https://twitter.com/setube",
                "https://facebook.com/setube"
              ],
              "potentialAction": {
                "@type": "SearchAction",
                "target": "${BASE_URL}/?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          `}
        </script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
