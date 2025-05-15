[route.ts](http://_vscodecontentref_/1)import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { Configuration, OpenAIApi } from "openai"

// Initialize OpenAI API 
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

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
    const filePath = join(uploadDir, `${id}-${file.name}`)
    await writeFile(filePath, buffer)

    // Mock extracted data
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

    // Generate GPT-3 suggestions
    const prompt = `
      Analyze the following CV data and provide 3 improvement suggestions:
      
      Personal Info:
      Name: ${mockData.personalInfo.name}
      Email: ${mockData.personalInfo.email}
      Phone: ${mockData.personalInfo.phone}
      Address: ${mockData.personalInfo.address}
      
      Education:
      ${mockData.education.map(
        (edu) =>
          `Degree: ${edu.degree}, Institution: ${edu.institution}, Location: ${edu.location}, Dates: ${edu.dates}`
      ).join("\n")}
      
      Experience:
      ${mockData.experience.map(
        (exp) =>
          `Title: ${exp.title}, Company: ${exp.company}, Location: ${exp.location}, Dates: ${exp.dates}, Responsibilities: ${exp.responsibilities.join(", ")}`
      ).join("\n")}
      
      Skills: ${mockData.skills.join(", ")}
      
      Provide suggestions in JSON format with the following structure:
      [
        {
          "id": 1,
          "type": "formatting|content|grammar",
          "section": "section name",
          "original": "original text",
          "suggestion": "improved text",
          "reason": "reason for suggestion"
        }
      ]
    `

    const gptResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    })

    const suggestions = JSON.parse(gptResponse.data.choices[0].message?.content || "[]")

    return NextResponse.json({
      message: "Datei erfolgreich hochgeladen und analysiert",
      fileId: id,
      fileName: file.name,
      data: mockData,
      suggestions,
    })
  } catch (error) {
    console.error("Fehler beim Hochladen oder Analysieren:", error)
    return NextResponse.json({ error: "Fehler beim Hochladen oder Analysieren der Datei" }, { status: 500 })
  }
}