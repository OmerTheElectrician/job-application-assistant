"use client"
import { Upload } from "@/components/upload"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { HowToGuide } from "@/components/how-to-guide"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header mit Titel und Definition */}
      <header className="bg-primary text-primary-foreground py-3 sm:py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Bewerbungs-Optimierer</h1>
          <p className="text-sm sm:text-base mt-1">Verbessere deine Bewerbungsunterlagen mit KI-Unterstützung</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
        {/* Upload-Bereich - nach oben verschoben */}
        <section id="upload" className="py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Bewerbungsunterlagen hochladen</h2>
          <Upload />
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => document.getElementById("guide")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-lg font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors"
            >
              Zur Anleitung scrollen
            </button>
          </div>
        </section>

        {/* Hero-Bereich */}
        <Hero />

        {/* Anleitung-Bereich */}
        <section id="guide" className="py-8 sm:py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-8">Anleitung zur Nutzung</h2>
          <HowToGuide />
        </section>
      </main>
      <Footer />
    </div>
  )
}

