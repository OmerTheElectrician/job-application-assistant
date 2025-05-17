import Link from "next/link"
import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'

export function Footer() {
  return (
    <footer className="border-t py-4 sm:py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Bewerbungs-Optimierung. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}

