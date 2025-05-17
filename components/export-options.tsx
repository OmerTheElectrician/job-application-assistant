"use client"

import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'
import { useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface ExportOptionsProps {
  fileName: string
  fileId: string
}

export function ExportOptions({ fileName, fileId }: ExportOptionsProps) {
  const [fileFormat, setFileFormat] = useState<"pdf" | "docx">("pdf")
  const [includeComments, setIncludeComments] = useState(true)
  const [includeTrackChanges, setIncludeTrackChanges] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const handleDownload = async () => {
    if (!fileId) return

    setIsExporting(true)

    try {
      // Sende Export-Anfrage an den Server
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          format: fileFormat,
          options: {
            includeComments,
            includeTrackChanges,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Fehler beim Exportieren")
      }

      const data = await response.json()

      // In einer echten Anwendung würdest du hier den Download starten
      // Für dieses Beispiel zeigen wir nur eine Meldung an
      alert(`Dokument würde heruntergeladen: ${fileName.split(".")[0]}_optimiert.${fileFormat}`)
    } catch (error) {
      console.error("Fehler beim Exportieren:", error)
      alert("Fehler beim Exportieren des Dokuments")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Dokumentvorschau</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Vorschau deines optimierten Dokuments vor dem Herunterladen
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="border rounded-md p-4 w-full max-w-md aspect-[3/4] flex items-center justify-center bg-muted/50">
            <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl">Export-Einstellungen</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Konfiguriere deine Export-Optionen</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm sm:text-base font-medium">Dateiformat</h4>
            <RadioGroup
              defaultValue="pdf"
              value={fileFormat}
              onValueChange={(value) => setFileFormat(value as "pdf" | "docx")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="text-sm sm:text-base">
                  PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="docx" id="docx" />
                <Label htmlFor="docx" className="text-sm sm:text-base">
                  DOCX (Microsoft Word)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-medium">Zusätzliche Optionen</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comments" className="text-sm sm:text-base">
                  Kommentare einschließen
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Verbesserungskommentare im Dokument anzeigen</p>
              </div>
              <Switch id="comments" checked={includeComments} onCheckedChange={setIncludeComments} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="track-changes" className="text-sm sm:text-base">
                  Änderungsverfolgung
                </Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Originaltext mit verfolgten Änderungen anzeigen
                </p>
              </div>
              <Switch id="track-changes" checked={includeTrackChanges} onCheckedChange={setIncludeTrackChanges} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDownload} className="w-full" disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Wird exportiert..." : "Optimiertes Dokument herunterladen"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

