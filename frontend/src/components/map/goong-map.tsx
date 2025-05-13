"use client";

import { Button } from "@/components/ui/button";
import { GoogleMapComponentProps } from "@/interfaces";
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
  stores,
  selectedStore,
  onStoreSelect,
  onLoad,
}: GoogleMapComponentProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
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

  // Chỉ hiển thị chi tiết khi click (selectedStore thay đổi)
  useEffect(() => {
    if (selectedStore) {
      setViewport({
        latitude: selectedStore.lat,
        longitude: selectedStore.lng,
        zoom: 15,
      });
      setActiveMarker(selectedStore.id);
    }
  }, [selectedStore]);

  const handleMarkerClick = (storeId: number) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      onStoreSelect(store);
      setActiveMarker(storeId);
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

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "store":
        return "https://cdn-icons-png.flaticon.com/512/869/869636.png";
      case "dealer":
        return "https://cdn-icons-png.flaticon.com/512/17666/17666078.png";
      case "distributor":
        return "https://cdn-icons-png.flaticon.com/512/407/407826.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/18063/18063935.png";
    }
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
        {stores.map((store) => (
          <div key={store.id} onClick={() => handleMarkerClick(store.id)}>
            <Marker
              latitude={store.lat}
              longitude={store.lng}
              offsetLeft={-16}
              offsetTop={-16}
              captureClick
            >
              <div
                style={{ cursor: "pointer" }}
              >
                <Image
                  src={getMarkerIcon(store.type)}
                  alt={store.name}
                  width={32}
                  height={32}
                  className={selectedStore?.id === store.id ? "animate-bounce" : ""}
                />
              </div>
            </Marker>
            {activeMarker === store.id && (
              <Popup
                latitude={store.lat}
                longitude={store.lng}
                onClose={() => setActiveMarker(null)}
                closeButton={true}
                closeOnClick={false}
                anchor="bottom"
              >
                <div className="p-2 max-w-xs">
                  <div className="w-full h-24 mb-2">
                    <Image
                      src={store.images[0] || "/placeholder.png"}
                      alt={store.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                  <h3 className="font-semibold text-sm">{store.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{store.address}</p>
                </div>
              </Popup>
            )}
          </div>
        ))}
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