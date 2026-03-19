import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jasongonzalezdeveloper.github.io/math_jenga"),
  title: {
    default: "Math Jenga – Juego Educativo de Matemáticas",
    template: "%s | Math Jenga",
  },
  description:
    "Math Jenga es un juego educativo interactivo gratuito que combina el clásico Jenga con retos de aritmética. Ideal para que niños de primaria practiquen suma y resta de forma divertida. Disponible en español e inglés.",
  keywords: [
    // English
    "math jenga",
    "math game for kids",
    "educational math game",
    "kids math game",
    "elementary school math game",
    "arithmetic game",
    "addition subtraction game",
    "interactive math game",
    "free math game online",
    "math practice game",
    "jenga math game",
    "primary school math",
    "fun math game",
    // Spanish
    "juego de matemáticas",
    "jenga matemático",
    "juego educativo matemáticas",
    "suma y resta",
    "matemáticas primaria",
    "juego matemático para niños",
    "practicar matemáticas",
    "juego interactivo matemáticas",
    "aprender matemáticas jugando",
    "juego educativo gratis",
    "juego de jenga matematicas",
    "ejercicios de matematicas para niños",
  ],
  authors: [{ name: "Jason González" }],
  creator: "Jason González",
  publisher: "Jason González",
  alternates: {
    canonical: "/config",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "https://jasongonzalezdeveloper.github.io/math_jenga/config",
    siteName: "Math Jenga",
    title: "Math Jenga – Juego Educativo de Matemáticas",
    description:
      "Juego gratuito de Jenga con retos de matemáticas para niños de primaria. Practica suma y resta mientras te diviertes. Disponible en español e inglés.",
    images: [
      {
        url: "/screenshots/tower-view.png",
        width: 1200,
        height: 630,
        alt: "Math Jenga – Tablero del juego con torre de bloques numerados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Math Jenga – Juego Educativo de Matemáticas",
    description:
      "Juego gratuito de Jenga con retos de matemáticas para niños de primaria. Practica suma y resta mientras te diviertes.",
    images: ["/screenshots/tower-view.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
