"use client";

import { Button } from "@/components/ui/button";
import { GoongMapComponentProps } from "@/interfaces";
import { Navigation } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

// Dynamic import để tránh lỗi SSR
const ReactMapGL = dynamic(
  () => import("@goongmaps/goong-map-react").then((mod) => mod.default),
  { ssr: false }
);
const Marker = dynamic(
  () => import("@goongmaps/goong-map-react").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("@goongmaps/goong-map-react").then((mod) => mod.Popup),
  { ssr: false }
);

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 16.047079,
  lng: 108.20623,
};

export default function GoongMapComponent({
  inventories,
  selectedInventory,
  onStoreSelect,
  onLoad,
}: GoongMapComponentProps) {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [map, setMap] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [viewport, setViewport] = useState({
    latitude: defaultCenter.lat,
    longitude: defaultCenter.lng,
    zoom: 6,
  });

  // Lấy vị trí hiện tại và zoom đến đó khi load lần đầu
  useEffect(() => {
    if (navigator.geolocation && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setViewport({
            latitude,
            longitude,
            zoom: 12,
          });
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [currentLocation]);

  const onMapLoad = useCallback(
    (map: any) => {
      setMap(map);
      if (onLoad) {
        onLoad(map);
      }
    },
    [onLoad]
  );

  // Chỉ hiển thị chi tiết khi click (selectedInventory thay đổi)
  useEffect(() => {
    if (selectedInventory) {
      const lat = parseFloat(selectedInventory.invenstory_lat || "16.047079");
      const lng = parseFloat(selectedInventory.invenstory_lng || "108.20623");
      setViewport({
        latitude: lat,
        longitude: lng,
        zoom: 15,
      });
      setActiveMarker(selectedInventory.invenstory_id);
    }
  }, [selectedInventory]);

  const handleMarkerClick = (inventoryId: string) => {
    const inventory = inventories.find(
      (inv) => inv.invenstory_id === inventoryId
    );
    if (inventory) {
      onStoreSelect(inventory);
      setActiveMarker(inventoryId);
    }
  };

  const handleReturnToCurrentLocation = () => {
    if (currentLocation) {
      setViewport({
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        zoom: 12,
      });
    }
  };

  const getMarkerIcon = () => {
    // All stores use the same icon now
    return "https://cdn-icons-png.flaticon.com/512/869/869636.png";
  };

  return (
    <div className="relative w-full h-full">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
        goongApiAccessToken={process.env.NEXT_PUBLIC_GOONG_MAPS_KEY}
        onViewportChange={setViewport}
        onLoad={onMapLoad}
      >
        {/* Marker cho vị trí hiện tại */}
        {currentLocation && (
          <Marker
            latitude={currentLocation.lat}
            longitude={currentLocation.lng}
            offsetLeft={-20}
            offsetTop={-20}
          >
            <Image
              src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              alt="Vị trí của bạn"
              width={40}
              height={40}
            />
          </Marker>
        )}

        {/* Marker cho các cửa hàng */}
        {inventories.map((inventory) => {
          const lat = parseFloat(inventory.invenstory_lat || "16.047079");
          const lng = parseFloat(inventory.invenstory_lng || "108.20623");
          const storeName =
            inventory.name || inventory.distributor.full_name || "Cửa hàng";

          return (
            <div
              key={inventory.invenstory_id}
              onClick={() => handleMarkerClick(inventory.invenstory_id)}
            >
              <Marker
                latitude={lat}
                longitude={lng}
                offsetLeft={-16}
                offsetTop={-16}
                captureClick
              >
                <div style={{ cursor: "pointer" }}>
                  <Image
                    src={getMarkerIcon()}
                    alt={storeName}
                    width={32}
                    height={32}
                    className={
                      selectedInventory?.invenstory_id ===
                      inventory.invenstory_id
                        ? "animate-bounce"
                        : ""
                    }
                  />
                </div>
              </Marker>
              {activeMarker === inventory.invenstory_id && (
                <Popup
                  latitude={lat}
                  longitude={lng}
                  onClose={() => setActiveMarker(null)}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="bottom"
                >
                  <div className="p-2 max-w-xs">
                    <div className="w-full h-24 mb-2">
                      <Image
                        src={inventory.invenstory_img || "/placeholder.png"}
                        alt={storeName}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                    <h3 className="font-semibold text-sm">{storeName}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {inventory.invenstory_address || "Chưa có địa chỉ"}
                    </p>
                  </div>
                </Popup>
              )}
            </div>
          );
        })}
      </ReactMapGL>

      {currentLocation && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={handleReturnToCurrentLocation}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
