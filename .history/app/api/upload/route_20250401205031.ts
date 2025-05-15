import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 })
    }

    // Überprüfe den Dateityp
    if (
      file.type !== "application/pdf" &&
      file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return NextResponse.json({ error: "Nur PDF- und DOCX-Dateien sind erlaubt" }, { status: 400 })
    }

    // Erstelle eine eindeutige ID für die Datei
    const id = uuidv4()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Erstelle den Uploads-Ordner, falls er nicht existiert
    const uploadDir = join(process.cwd(), "uploads")

    // Speichere die Datei
    const filePath = join(uploadDir, `${id}-${file.name}`)
    await writeFile(filePath, buffer)

    // Simuliere eine Analyse (in einer echten Anwendung würdest du hier den Inhalt extrahieren)
    const mockData = {
      personalInfo: {
        name: "Max Mustermann",
        email: "max.mustermann@example.com",
        phone: "+49 123 456789",
        address: "Musterstraße 123, 12345 Berlin",
      },
      education: [
        {
          degree: "Bachelor of Science in Informatik",
          institution: "Technische Universität Berlin",
          location: "Berlin",
          dates: "2015 - 2019",
        },
      ],
      experience: [
        {
          title: "Software Entwickler",
          company: "Tech Solutions GmbH",
          location: "Berlin",
          dates: "2019 - Heute",
          responsibilities: [
            "Entwicklung und Wartung von Webanwendungen mit React und Node.js",
            "Zusammenarbeit mit funktionsübergreifenden Teams",
            "Implementierung von CI/CD-Pipelines",
          ],
        },
      ],
      skills: ["JavaScript", "React", "Node.js", "HTML", "CSS", "Git"],
    }

    return NextResponse.json({
      message: "Datei erfolgreich hochgeladen und analysiert",
      fileId: id,
      fileName: file.name,
      data: mockData,
    })
  } catch (error) {
    console.error("Fehler beim Hochladen:", error)
    return NextResponse.json({ error: "Fehler beim Hochladen der Datei" }, { status: 500 })
  }
}

