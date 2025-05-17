"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"
import { CVData, APIResponse } from '@/types/api'
import { validateEnv } from '@/config/env'
import { FILE_SIZE_LIMIT, ACCEPTED_FILE_TYPES } from '@/config/constants'

interface PersonalInfo {
  name: string
  email: string
  phone: string
  address: string
}

interface Education {
  degree: string
  institution: string
  location: string
  dates: string
}

interface Experience {
  title: string
  company: string
  location: string
  dates: string
  responsibilities: string[]
}

interface ExtractedData {
  personalInfo: PersonalInfo
  education: Education[]
  experience: Experience[]
  skills: string[]
}

interface ExtractedContentProps {
  data: ExtractedData
}

export function ExtractedContent({ data }: ExtractedContentProps) {
  const isMobile = useMobile()

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className={`grid w-full ${isMobile ? "grid-cols-2 gap-1" : "grid-cols-4"}`}>
        <TabsTrigger value="overview">Übersicht</TabsTrigger>
        <TabsTrigger value="personal">Persönliche Daten</TabsTrigger>
        <TabsTrigger value="experience">Berufserfahrung</TabsTrigger>
        <TabsTrigger value="skills">Fähigkeiten</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">{data.personalInfo.name}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {data.personalInfo.email} | {data.personalInfo.phone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-semibold mb-2">Berufserfahrung</h4>
                <ul className="space-y-2">
                  {data.experience.slice(0, 2).map((exp, index) => (
                    <li key={index}>
                      <div className="text-sm sm:text-base font-medium">{exp.title}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {exp.company}, {exp.dates}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-semibold mb-2">Ausbildung</h4>
                <ul className="space-y-2">
                  {data.education.map((edu, index) => (
                    <li key={index}>
                      <div className="text-sm sm:text-base font-medium">{edu.degree}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {edu.institution}, {edu.dates}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm sm:text-base font-semibold mb-2">Fähigkeiten</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {data.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-secondary text-secondary-foreground rounded-md text-xs sm:text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="personal" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Persönliche Daten</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
              <div>
                <dt className="font-medium text-muted-foreground">Name</dt>
                <dd>{data.personalInfo.name}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">E-Mail</dt>
                <dd className="break-all">{data.personalInfo.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Telefon</dt>
                <dd>{data.personalInfo.phone}</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Adresse</dt>
                <dd>{data.personalInfo.address}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="experience" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Berufserfahrung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6 text-sm sm:text-base">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold">{exp.title}</h4>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {exp.company} | {exp.location} | {exp.dates}
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="skills" className="space-y-4 mt-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">Fähigkeiten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-secondary text-secondary-foreground rounded-md text-xs sm:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

