import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center agricultural-texture">
      <Card className="w-full max-w-md card-agricultural">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-primary-strong" />
            <span className="text-2xl font-bold text-primary-deep">FarmE</span>
          </div>
          <CardTitle className="text-primary-deep">Không tìm thấy trang</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-primary-dark">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
          <Button asChild className="btn-primary">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Quay về trang chủ
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
