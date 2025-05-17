"use client"

import type React from "react"

import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'

import { useState } from "react"
import { UploadIcon, File, X, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ExtractedContent } from "@/components/extracted-content"
import { Suggestions } from "@/components/suggestions"
import { ExportOptions } from "@/components/export-options"
import { useMobile } from "@/hooks/use-mobile"

export function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<"upload" | "review" | "suggestions" | "export">("upload")
  const [error, setError] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [fileId, setFileId] = useState<string | null>(null)
  const isMobile = useMobile()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Überprüfe, ob die Datei PDF oder DOCX ist
      const fileType = selectedFile.type
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError("Bitte lade eine PDF- oder DOCX-Datei hoch")
        setFile(null)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      // Überprüfe, ob die Datei PDF oder DOCX ist
      const fileType = droppedFile.type
      if (
        fileType === "application/pdf" ||
        fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError("Bitte lade eine PDF- oder DOCX-Datei hoch")
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simuliere Upload-Fortschritt
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      // Erstelle FormData für den Upload
      const formData = new FormData()
      formData.append("file", file)

      // Sende die Datei an den Server
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Fehler beim Hochladen")
      }

      const data = await response.json()
      setFileId(data.fileId)
      setExtractedData(data.data)

      clearInterval(interval)
      setUploadProgress(100)
      setIsUploading(false)
      setIsProcessing(true)

      // Simuliere Verarbeitungsverzögerung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsProcessing(false)
      setCurrentStep("review")
    } catch (error) {
      clearInterval(interval)
      setError(error instanceof Error ? error.message : "Fehler beim Hochladen")
      setIsUploading(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
  }

  const handleProceedToSuggestions = async () => {
    if (!fileId || !extractedData) return

    setIsProcessing(true)

    try {
      // Hole Vorschläge vom Server
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          data: extractedData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Fehler beim Abrufen der Vorschläge")
      }

      const data = await response.json()
      setSuggestions(data.suggestions)
      setCurrentStep("suggestions")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Fehler beim Abrufen der Vorschläge")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProceedToExport = () => {
    setCurrentStep("export")
  }

  const handleReset = () => {
    setFile(null)
    setCurrentStep("upload")
    setError(null)
    setFileId(null)
    setExtractedData(null)
    setSuggestions([])
  }

  return (
    <Card className="w-full">
      <CardContent className="p-3 sm:p-6">
        {currentStep === "upload" && (
          <div className="space-y-3 sm:space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center ${error ? "border-destructive" : "border-muted-foreground/25"}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!file ? (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-center">
                    <UploadIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-base sm:text-lg font-medium">
                      Ziehe deine Datei hierher oder klicke zum Durchsuchen
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">Unterstützt PDF- und DOCX-Dateien</p>
                  </div>
                  <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                    Datei auswählen
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <File className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    <span className="text-base sm:text-lg font-medium truncate max-w-[200px] sm:max-w-md">
                      {file.name}
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <div className="space-y-2 w-full max-w-md mx-auto">
                      <Progress value={uploadProgress} className="h-2 w-full" />
                      <p className="text-xs sm:text-sm text-muted-foreground">{uploadProgress}% hochgeladen</p>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                      <span className="text-xs sm:text-sm text-muted-foreground">Dokument wird analysiert...</span>
                    </div>
                  )}

                  {!isUploading && !isProcessing && <Button onClick={handleUpload}>Dokument analysieren</Button>}
                </div>
              )}
            </div>
            {error && (
              <div className="flex items-center text-destructive space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}
          </div>
        )}

        {currentStep === "review" && extractedData && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-semibold">Extrahierte Daten</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={handleReset}>
                  Neues Dokument hochladen
                </Button>
                <Button size={isMobile ? "sm" : "default"} onClick={handleProceedToSuggestions}>
                  Weiter zu Verbesserungsvorschlägen
                </Button>
              </div>
            </div>
            <ExtractedContent data={extractedData} />
          </div>
        )}

        {currentStep === "suggestions" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-semibold">Verbesserungsvorschläge</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => setCurrentStep("review")}>
                  Zurück zur Übersicht
                </Button>
                <Button size={isMobile ? "sm" : "default"} onClick={handleProceedToExport}>
                  Weiter zum Export
                </Button>
              </div>
            </div>
            <Suggestions suggestions={suggestions} />
          </div>
        )}

        {currentStep === "export" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-semibold">Optimiertes Dokument exportieren</h3>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "default"}
                onClick={() => setCurrentStep("suggestions")}
              >
                Zurück zu Verbesserungsvorschlägen
              </Button>
            </div>
            <ExportOptions fileName={file?.name || "dokument"} fileId={fileId || ""} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

