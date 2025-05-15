import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileId, data } = await request.json()

    if (!fileId || !data) {
      return NextResponse.json({ error: "Fehlende Daten für die Vorschlagsgenerierung" }, { status: 400 })
    }

    // Simuliere die Generierung von Vorschlägen
    // In einer echten Anwendung würdest du hier die Daten analysieren
    const suggestions = [
      {
        id: 1,
        type: "formatting",
        section: "Kopfzeile",
        original: `${data.personalInfo.name}\n${data.personalInfo.email}\n${data.personalInfo.phone}`,
        suggestion: `${data.personalInfo.name}\n${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.address}`,
        reason: "Bessere Anordnung und Organisation der Kontaktinformationen",
      },
      {
        id: 2,
        type: "content",
        section: "Berufserfahrung",
        original: data.experience[0]?.responsibilities[0] || "",
        suggestion: `${data.experience[0]?.responsibilities[0] || ""}, was zu einer 30% verbesserten Benutzerinteraktion führte`,
        reason: "Hinzufügen von quantifizierbaren Erfolgen macht Ihre Erfahrung aussagekräftiger",
      },
      {
        id: 3,
        type: "grammar",
        section: "Zusammenfassung",
        original: "Engagierter Entwickler mit Erfahrung in Webentwicklung",
        suggestion: "Engagierter Entwickler mit umfangreicher Erfahrung in Full-Stack-Webentwicklung",
        reason: "Präzisere und professionellere Formulierung",
      },
    ]

    return NextResponse.json({
      message: "Vorschläge erfolgreich generiert",
      fileId,
      suggestions,
    })
  } catch (error) {
    console.error("Fehler bei der Vorschlagsgenerierung:", error)
    return NextResponse.json({ error: "Fehler bei der Vorschlagsgenerierung" }, { status: 500 })
  }
}

