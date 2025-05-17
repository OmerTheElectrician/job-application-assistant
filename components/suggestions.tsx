"use client"

import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'
import { useState } from "react"
import { Check, X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMobile } from "@/hooks/use-mobile"

interface Suggestion {
  id: number
  type: "formatting" | "content" | "grammar"
  section: string
  original: string
  suggestion: string
  reason: string
}

interface SuggestionsProps {
  suggestions: Suggestion[]
}

export function Suggestions({ suggestions }: SuggestionsProps) {
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<number[]>([])
  const [rejectedSuggestions, setRejectedSuggestions] = useState<number[]>([])
  const isMobile = useMobile()

  const formatSuggestions = suggestions.filter((s) => s.type === "formatting")
  const contentSuggestions = suggestions.filter((s) => s.type === "content")
  const grammarSuggestions = suggestions.filter((s) => s.type === "grammar")

  const handleAccept = (id: number) => {
    setAcceptedSuggestions((prev) => [...prev, id])
    setRejectedSuggestions((prev) => prev.filter((suggId) => suggId !== id))
  }

  const handleReject = (id: number) => {
    setRejectedSuggestions((prev) => [...prev, id])
    setAcceptedSuggestions((prev) => prev.filter((suggId) => suggId !== id))
  }

  const getStatus = (id: number) => {
    if (acceptedSuggestions.includes(id)) return "accepted"
    if (rejectedSuggestions.includes(id)) return "rejected"
    return "pending"
  }

  const renderSuggestionCard = (suggestion: Suggestion) => {
    const status = getStatus(suggestion.id)

    return (
      <Card
        key={suggestion.id}
        className={`mb-3 sm:mb-4 ${status === "accepted" ? "border-green-500" : status === "rejected" ? "border-red-500" : ""}`}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">{suggestion.section}</CardTitle>
              <CardDescription>
                <Badge
                  variant={
                    suggestion.type === "formatting"
                      ? "outline"
                      : suggestion.type === "content"
                        ? "secondary"
                        : "default"
                  }
                  className="text-xs"
                >
                  {suggestion.type === "formatting"
                    ? "Formatierung"
                    : suggestion.type === "content"
                      ? "Inhalt"
                      : "Grammatik"}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {status === "pending" && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600 text-xs sm:text-sm"
                    onClick={() => handleAccept(suggestion.id)}
                  >
                    <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Akzeptieren
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 text-xs sm:text-sm"
                    onClick={() => handleReject(suggestion.id)}
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Ablehnen
                  </Button>
                </>
              )}
              {status === "accepted" && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> Akzeptiert
                </Badge>
              )}
              {status === "rejected" && (
                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                  <X className="h-3 w-3 mr-1" /> Abgelehnt
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Original</div>
              <div className="p-2 sm:p-3 bg-muted rounded-md whitespace-pre-line text-xs sm:text-sm">
                {suggestion.original}
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground">Vorschlag</div>
              <div className="p-2 sm:p-3 bg-primary/5 rounded-md whitespace-pre-line text-xs sm:text-sm">
                {suggestion.suggestion}
              </div>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-start space-x-2 text-xs sm:text-sm text-muted-foreground">
            <Info className="h-3 w-3 sm:h-4 sm:w-4 mt-0.5 flex-shrink-0" />
            <p>{suggestion.reason}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {acceptedSuggestions.length} akzeptiert, {rejectedSuggestions.length} abgelehnt,{" "}
            {suggestions.length - acceptedSuggestions.length - rejectedSuggestions.length} ausstehend
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs sm:text-sm"
            onClick={() => setAcceptedSuggestions(suggestions.map((s) => s.id))}
          >
            Alle akzeptieren
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs sm:text-sm"
            onClick={() => {
              setAcceptedSuggestions([])
              setRejectedSuggestions([])
            }}
          >
            Zurücksetzen
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className={`${isMobile ? "grid grid-cols-2 gap-1" : ""}`}>
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            Alle ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="formatting" className="text-xs sm:text-sm">
            Formatierung ({formatSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            Inhalt ({contentSuggestions.length})
          </TabsTrigger>
          <TabsTrigger value="grammar" className="text-xs sm:text-sm">
            Grammatik ({grammarSuggestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-3 sm:mt-4">
          {suggestions.map(renderSuggestionCard)}
        </TabsContent>

        <TabsContent value="formatting" className="mt-3 sm:mt-4">
          {formatSuggestions.map(renderSuggestionCard)}
        </TabsContent>

        <TabsContent value="content" className="mt-3 sm:mt-4">
          {contentSuggestions.map(renderSuggestionCard)}
        </TabsContent>

        <TabsContent value="grammar" className="mt-3 sm:mt-4">
          {grammarSuggestions.map(renderSuggestionCard)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

