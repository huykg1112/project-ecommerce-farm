"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { sellers } from "@/data/sellers"

export default function FeaturedSellers() {
  const [startIndex, setStartIndex] = useState(0)
  const visibleSellers = 4

  const nextSellers = () => {
    setStartIndex((prev) => (prev + visibleSellers >= sellers.length ? 0 : prev + visibleSellers))
  }

  const prevSellers = () => {
    setStartIndex((prev) =>
      prev - visibleSellers < 0 ? Math.max(0, sellers.length - visibleSellers) : prev - visibleSellers,
    )
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sellers.slice(startIndex, startIndex + visibleSellers).map((seller) => (
          <Card key={seller.id} className="overflow-hidden border-none shadow-md">
            <div className="relative h-32 bg-gradient-to-r from-primary-light to-primary">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <Image
                  src={seller.avatar || "/placeholder.svg"}
                  alt={seller.name}
                  width={80}
                  height={80}
                  className="rounded-full border-4 border-white"
                />
              </div>
            </div>
            <CardContent className="pt-16 pb-4 text-center">
              <Link href={`/seller/${seller.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary">{seller.name}</h3>
              </Link>
              <div className="flex items-center justify-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(seller.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({seller.ratingCount})</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">{seller.productCount} sản phẩm</p>
              {seller.verified && <Badge className="mt-2 bg-green-500">Đã xác thực</Badge>}
              <Button asChild className="mt-4 w-full bg-primary hover:bg-primary-dark">
                <Link href={`/seller/${seller.id}`}>Xem cửa hàng</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {sellers.length > visibleSellers && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100 hidden md:flex"
            onClick={prevSellers}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md hover:bg-gray-100 hidden md:flex"
            onClick={nextSellers}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>
        </>
      )}
    </div>
  )
}

