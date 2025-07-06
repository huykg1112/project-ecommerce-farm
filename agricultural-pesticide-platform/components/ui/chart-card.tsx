import { memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer } from "recharts"
import type React from "react"

interface ChartCardProps {
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

export const ChartCard = memo<ChartCardProps>(({ title, description, children, className = "" }) => {
  return (
    <Card className={`card-agricultural ${className}`}>
      <CardHeader>
        <CardTitle className="text-agricultural-primary font-bold">{title}</CardTitle>
        <CardDescription className="text-agricultural-secondary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
})

ChartCard.displayName = "ChartCard"
