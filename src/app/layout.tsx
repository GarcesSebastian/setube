import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Setube - Descargar YouTube a MP3, WAV y M4A | Convertidor Gratuito",
  description: "Setube es el convertidor más rápido y fácil de usar para descargar videos de YouTube como MP3, WAV y M4A. Convierte listas de reproducción y videos individuales de forma gratuita.",
  keywords: "setube, descargar youtube, convertidor youtube, youtube a mp3, descargar musica youtube, youtube to mp3, descargar videos youtube, convertidor gratuito",
  authors: [{ name: "Setube" }],
  creator: "Setube",
  publisher: "Setube",
  robots: "index, follow",
  openGraph: {
    title: "Setube - Convertidor YouTube Gratuito",
    description: "Convierte videos de YouTube a MP3, WAV y M4A de forma rápida y fácil.",
    url: "https://setube.com",
    siteName: "Setube",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Setube - Convertidor YouTube Gratuito",
    description: "Convierte videos de YouTube a MP3, WAV y M4A de forma rápida y fácil.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
