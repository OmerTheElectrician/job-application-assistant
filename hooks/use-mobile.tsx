"use client"

import { useState, useEffect, useCallback } from "react"

const MOBILE_BREAKPOINT = 640 // sm breakpoint in Tailwind
const DEBOUNCE_DELAY = 250 // ms

export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const checkMobile = useCallback(() => {
    const isMobileView = window.innerWidth < MOBILE_BREAKPOINT
    if (isMobileView !== isMobile) {
      setIsMobile(isMobileView)
    }
  }, [isMobile])

  useEffect(() => {
    // Initial check
    checkMobile()

    // Debounced resize handler
    let timeoutId: NodeJS.Timeout
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, DEBOUNCE_DELAY)
    }

    window.addEventListener("resize", debouncedCheckMobile)

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", debouncedCheckMobile)
    }
  }, [checkMobile])

  return isMobile
}

