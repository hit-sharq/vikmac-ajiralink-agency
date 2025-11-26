"use client"

import { useEffect, useState } from "react"
import CookieConsent from "react-cookie-consent"

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="vikmac-cookie-consent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      declineButtonStyle={{ fontSize: "13px" }}
      expires={150}
      onAccept={() => {
        // Enable analytics, etc.
        console.log("Cookies accepted")
      }}
      onDecline={() => {
        // Disable non-essential cookies
        console.log("Cookies declined")
      }}
    >
      This website uses cookies to enhance the user experience. By continuing to use this site, you agree to our use of
      cookies.{" "}
      <a href="/privacy" style={{ color: "#FFD700" }}>
        Learn more
      </a>
    </CookieConsent>
  )
}
