"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, StoreDetailProps } from "@/interfaces";
import {
  Clock,
  Globe,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Star,
} from "lucide-react";

const StoreDetail = ({ store, onClose }: StoreDetailProps) => {
  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`,
      "_blank"
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chi tiết cửa hàng</h2>
        {/* <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button> */}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={store.images[0] || "/placeholder.svg?height=200&width=400"}
            alt={store.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">{store.name}</h3>
            <Badge>
              {store.type === "store"
                ? "Cửa hàng"
                : store.type === "dealer"
                ? "Đại lý"
                : "Nhà phân phối"}
            </Badge>
          </div>

          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(store.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
            </div>
            <span className="ml-1">{store.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
            <span>{store.address}</span>
          </div>

          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
            <a href={`tel:${store.phone}`} className="hover:underline">
              {store.phone}
            </a>
          </div>

          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            <a href={`mailto:${store.email}`} className="hover:underline">
              {store.email}
            </a>
          </div>

          {store.website && (
            <div className="flex items-center">
              <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
              <a
                href={store.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {store.website}
              </a>
            </div>
          )}

          <div className="flex items-start">
            <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
            <div>
              {store.openingHours.map((hours, index) => (
                <div key={index} className="flex items-center">
                  <span className="font-semibold">{hours.days}:</span>
                  <span className="ml-2">{hours.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={handleGetDirections}>
          <Navigation className="h-4 w-4 mr-2" />
          Chỉ đường
        </Button>
      </div>
    </div>
  );
};

export default StoreDetail;
