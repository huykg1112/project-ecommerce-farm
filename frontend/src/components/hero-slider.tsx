"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/images/hero-1.jpg",
    title: "Sản phẩm nông nghiệp tươi ngon",
    description: "Trực tiếp từ nông trại đến bàn ăn của bạn",
    buttonText: "Mua ngay",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
    title: "Vật tư nông nghiệp chất lượng cao",
    description: "Đầy đủ các loại vật tư, phân bón, thuốc bảo vệ thực vật",
    buttonText: "Khám phá",
    buttonLink: "/category/vat-tu",
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
    title: "Hạt giống chất lượng",
    description: "Đa dạng các loại hạt giống, đảm bảo tỷ lệ nảy mầm cao",
    buttonText: "Tìm hiểu thêm",
    buttonLink: "/category/hat-giong",
  },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 hero-slide ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-xl text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
                  <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

