import { FileText, CheckCircle, Download, ArrowRight, CheckCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function HowToGuide() {
  const steps = [
    {
      icon: <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
      title: "Dokument hochladen",
      description:
        "Lade deine Bewerbungsunterlagen im PDF- oder DOCX-Format hoch. Du kannst die Datei per Drag & Drop ziehen oder über den Datei-Browser auswählen.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
      title: "Extrahierte Daten überprüfen",
      description:
        "Nach dem Hochladen werden die Daten aus deinem Dokument extrahiert und übersichtlich dargestellt. Überprüfe, ob alle Informationen korrekt erkannt wurden.",
    },
    {
      icon: <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
      title: "Verbesserungsvorschläge prüfen",
      description:
        "Unser System analysiert deine Bewerbung und gibt dir Vorschläge zur Verbesserung. Du kannst jeden Vorschlag einzeln akzeptieren oder ablehnen.",
    },
    {
      icon: <Download className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
      title: "Optimierte Bewerbung herunterladen",
      description:
        "Nachdem du die Vorschläge geprüft hast, kannst du deine optimierte Bewerbung im gewünschten Format herunterladen und direkt verwenden.",
    },
  ]

  const tips = [
    "Passe deine Bewerbung an die jeweilige Stelle an",
    "Hebe deine relevanten Fähigkeiten und Erfahrungen hervor",
    "Verwende ein klares, professionelles Format",
    "Achte auf korrekte Rechtschreibung und Grammatik",
    "Sei präzise und vermeide unnötige Füllwörter",
    "Füge messbare Erfolge und konkrete Beispiele hinzu",
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      <p className="text-center text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
        Folge diesen einfachen Schritten, um deine Bewerbungsunterlagen zu optimieren und deine Chancen auf dem
        Arbeitsmarkt zu verbessern.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="border bg-card">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-2 sm:p-3 rounded-full bg-primary/10">{step.icon}</div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Schritt {index + 1}: {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Improved Tips Section */}
      <div className="mt-12 sm:mt-16 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 inline-flex items-center justify-center">
            <CheckCheck className="mr-2 h-6 w-6 text-primary" />
            Tipps für eine erfolgreiche Bewerbung
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                </div>
                <p className="text-sm sm:text-base">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

