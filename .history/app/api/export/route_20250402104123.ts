import { type NextRequest, NextResponse } from "next/server"
import PDFDocument from "pdfkit"
import { join } from "path"
import { writeFile } from "fs/promises"

export async function POST(request: NextRequest) {
  try {
    const { fileId, format, data } = await request.json()

    if (!fileId || !format || !data) {
      return NextResponse.json({ error: "Fehlende Daten für den Export" }, { status: 400 })
    }

    if (format !== "pdf") {
      return NextResponse.json({ error: "Nur PDF-Export wird unterstützt" }, { status: 400 })
    }

    // Generate PDF
    const pdfPath = join(process.cwd(), "exports", `${fileId}.pdf`)
    const pdfDoc = new PDFDocument()
    pdfDoc.pipe(await writeFile(pdfPath))

    // Add content to the PDF
    pdfDoc.fontSize(20).text("Bewerbung Optimiert", { align: "center" })
    pdfDoc.moveDown()
    pdfDoc.fontSize(12).text(`Name: ${data.personalInfo.name}`)
    pdfDoc.text(`Email: ${data.personalInfo.email}`)
    pdfDoc.text(`Phone: ${data.personalInfo.phone}`)
    pdfDoc.text(`Address: ${data.personalInfo.address}`)
    pdfDoc.moveDown()
    pdfDoc.text("Skills:")
    data.skills.forEach((skill: string) => pdfDoc.text(`- ${skill}`))
    pdfDoc.end()

    return NextResponse.json({
      message: "Dokument erfolgreich generiert",
      fileId,
      format,
      documentUrl: `/exports/${fileId}.pdf`,
    })
  } catch (error) {
    console.error("Fehler beim Exportieren:", error)
    return NextResponse.json({ error: "Fehler beim Exportieren des Dokuments" }, { status: 500 })
  }
}