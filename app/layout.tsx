import type React from "react"
import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CookieConsentBanner from "@/components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"




export const metadata: Metadata = {
  title: "VikMac AjiraLink Agency - Ajira Management Platform",
  description:
    "Leading global workforce management platform for recruitment, deployment, and HR operations. Connect employers with skilled professionals worldwide.",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <html lang="en">
          <body suppressHydrationWarning>
             <Header />
             <main style={{ paddingTop: '72px' }}>{children}</main>
             <Footer />
             <CookieConsentBanner />
           </body>
        </html>
      </ThemeProvider>
    </ClerkProvider>
  )
}
