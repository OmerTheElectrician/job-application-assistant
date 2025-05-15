"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Funktion zur Überprüfung, ob der Bildschirm mobil ist
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm-Breakpoint in Tailwind ist 640px
    }

    // Initiale Überprüfung
    checkMobile()

    // Event-Listener für Fenstergrößenänderungen hinzufügen
    window.addEventListener("resize", checkMobile)

    // Aufräumen
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return isMobile
}

