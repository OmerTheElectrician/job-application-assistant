import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"

// Helper function to extract text from PDF
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer)
  return data.text
}

// Helper function to extract text from DOCX
async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer })
  return value
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 })
    }

    // Check file type
    if (
      file.type !== "application/pdf" &&
      file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return NextResponse.json({ error: "Nur PDF- und DOCX-Dateien sind erlaubt" }, { status: 400 })
    }

    // Generate a unique ID for the file
    const id = uuidv4()
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create the uploads folder if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads")
    await mkdir(uploadDir, { recursive: true })
    const filePath = join(uploadDir, `${id}-${file.name}`)
    await writeFile(filePath, buffer)

    // Extract text from the file
    let extractedText = ""
    if (file.type === "application/pdf") {
      extractedText = await extractTextFromPDF(buffer)
    } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      extractedText = await extractTextFromDOCX(buffer)
    }

    // Mock structured data (you can replace this with real parsing logic)
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
      extractedText,
      data: mockData,
    })
  } catch (error) {
    console.error("Fehler beim Hochladen oder Analysieren:", error)
    return NextResponse.json({ error: "Fehler beim Hochladen oder Analysieren der Datei" }, { status: 500 })
  }
}