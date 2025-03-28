"use client";

import { Store } from "@/interfaces";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { Loader2, Navigation } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

interface GoogleMapComponentProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  onLoad?: (map: google.maps.Map) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 16.047079,
  lng: 108.20623,
};

export default function GoogleMapComponent({
  stores,
  selectedStore,
  onStoreSelect,
}: GoogleMapComponentProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Lấy vị trí hiện tại và zoom đến đó khi load lần đầu
  useEffect(() => {
    if (navigator.geolocation && !currentLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(12);
          }
        },
        (error) => {
          console.error("Lỗi khi lấy vị trí:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [map, currentLocation]);

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      if (currentLocation) {
        map.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
        map.setZoom(12);
      } else {
        const bounds = new google.maps.LatLngBounds();
        stores.forEach((store) => {
          bounds.extend(new google.maps.LatLng(store.lat, store.lng));
        });
        map.fitBounds(bounds);
      }
    },
    [stores, currentLocation]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Chỉ hiển thị chi tiết khi click (selectedStore thay đổi)
  useEffect(() => {
    if (map && selectedStore) {
      map.panTo({ lat: selectedStore.lat, lng: selectedStore.lng });
      map.setZoom(15);
      setActiveMarker(selectedStore.id);
    }
  }, [selectedStore, map]);

  const handleMarkerClick = (storeId: number) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      onStoreSelect(store);
      setActiveMarker(storeId);
    }
  };
  const handleReturnToCurrentLocation = () => {
    if (map && currentLocation) {
      map.panTo({ lat: currentLocation.lat, lng: currentLocation.lng });
      map.setZoom(12);
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

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500">Không thể tải Google Maps</p>
          <p className="text-sm text-muted-foreground">
            Vui lòng kiểm tra kết nối mạng và thử lại
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải bản đồ...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={6}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
      }}
    >
      {/* Marker cho vị trí hiện tại */}
      {currentLocation && (
        <MarkerF
          position={currentLocation}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new (window as any).google.maps.Size(40, 40),
          }}
          title="Vị trí của bạn"
        />
      )}

      {/* Marker cho các cửa hàng */}
      {stores.map((store) => (
        <MarkerF
          key={store.id}
          position={{ lat: store.lat, lng: store.lng }}
          onClick={() => handleMarkerClick(store.id)}
          icon={{
            url: getMarkerIcon(store.type),
            scaledSize: new (window as any).google.maps.Size(32, 32),
          }}
          animation={
            selectedStore?.id === store.id
              ? (window as any).google.maps.Animation.BOUNCE
              : undefined
          }
        >
          {activeMarker === store.id && (
            <InfoWindowF
              position={{ lat: store.lat, lng: store.lng }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-semibold text-sm">{store.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{store.address}</p>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
      ))}
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
    </GoogleMap>
  );
}
