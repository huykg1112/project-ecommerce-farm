"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center agricultural-texture">
      <Card className="w-full max-w-md card-agricultural">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-primary-deep">Đã xảy ra lỗi</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-primary-dark">Hệ thống gặp sự cố. Vui lòng thử lại hoặc liên hệ hỗ trợ kỹ thuật.</p>
          <Button onClick={reset} className="btn-primary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
