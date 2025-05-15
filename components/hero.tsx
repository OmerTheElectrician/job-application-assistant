export function Hero() {
  return (
    <section className="py-8 sm:py-12 md:py-16 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4">Bewerbungs-Optimierung</h1>
      <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
        Verbessere deine Bewerbungsunterlagen mit KI-gestützten Vorschlägen für deinen Lebenslauf, Anschreiben und
        andere Bewerbungsdokumente.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12">
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Dokumente hochladen</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Lade deine Bewerbungsunterlagen im PDF- oder DOCX-Format hoch.
          </p>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Verbesserungen erhalten</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Erhalte KI-gestützte Vorschläge für bessere Formulierungen und Formatierungen.
          </p>
        </div>
        <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border sm:col-span-2 md:col-span-1 sm:mx-auto md:mx-0 sm:max-w-md md:max-w-none">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">Optimierte Version herunterladen</h3>
          <p className="text-sm sm:text-base text-muted-foreground">
            Lade deine verbesserte Bewerbung im gewünschten Format herunter.
          </p>
        </div>
      </div>
    </section>
  )
}

