"use client";

import { Badge } from "@/components/ui/badge";
import { ProductImagesProps } from "@/interfaces";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

export default function ProductImages({
  productImages,
  activeImage,
  setActiveImage,
  productName,
  discount,
}: ProductImagesProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Memoize hình ảnh chính để tránh re-render không cần thiết
  const activeImageUrl = useMemo(
    () => productImages[activeImage] || "/placeholder.svg",
    [productImages, activeImage]
  );

  // Sử dụng useCallback để bọc các hàm xử lý sự kiện
  const handleMouseEnter = useCallback(() => {
    setZoom(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setZoom(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel((prev) => Math.max(1.5, Math.min(5, prev + delta)));
  }, []);

  // Memoize style của kính lúp để tránh tính toán lại khi không cần thiết
  const magnifierStyle = useMemo(
    () => ({
      width: "100px",
      height: "100px",
      left: position.x - 50,
      top: position.y - 50,
      zIndex: 10,
    }),
    [position.x, position.y, zoomLevel, activeImageUrl]
  );

  // Memoize style của ảnh chính
  const imageStyle = useMemo(
    () => ({
      transformOrigin: `${position.x}px ${position.y}px`,
      transform: zoom ? `scale(${zoomLevel})` : "scale(1)",
    }),
    [position.x, position.y, zoom, zoomLevel]
  );

  return (
    <div>
      <div
        ref={imageRef}
        className="relative aspect-square mb-4 border rounded-lg overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        style={{ cursor: zoom ? "none" : "default" }}
      >
        <Image
          src={activeImageUrl}
          alt={productName}
          fill
          className="object-cover transition-transform duration-200"
          style={imageStyle}
        />
        {discount && discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500">
            -{discount}%
          </Badge>
        )}
        {zoom && (
          <div
            className="absolute rounded-full border-2 border-gray-300 pointer-events-none"
            style={magnifierStyle}
          />
        )}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {productImages.map((image, index) => (
          <div
            key={index}
            className={`relative aspect-square border rounded-md overflow-hidden cursor-pointer ${
              activeImage === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setActiveImage(index)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} - Hình ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
