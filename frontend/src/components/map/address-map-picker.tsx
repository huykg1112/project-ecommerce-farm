"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast-provider";
import { Loader2, Locate, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import type React from "react";
import { useEffect, useState } from "react";

// Dynamic import để tránh lỗi SSR
const ReactMapGL = dynamic(
  () => import("@goongmaps/goong-map-react").then((mod) => mod.default),
  { ssr: false }
);
const Marker = dynamic(
  () => import("@goongmaps/goong-map-react").then((mod) => mod.Marker),
  { ssr: false }
);

// Định nghĩa kiểu dữ liệu cho địa chỉ
export interface AddressData {
  fullAddress: string;
  latitude: number;
  longitude: number;
  street?: string;
  ward?: string;
  district?: string;
  city?: string;
  notes?: string;
}

interface AddressMapPickerProps {
  onAddressChange: (address: AddressData) => void;
  initialAddress?: AddressData;
}

// Hàm kiểm tra tọa độ hợp lệ
const isValidCoordinate = (lat: number, lng: number) =>
  !isNaN(lat) &&
  !isNaN(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

export default function AddressMapPicker({
  onAddressChange,
  initialAddress,
}: AddressMapPickerProps) {
  // Khởi tạo tọa độ mặc định an toàn
  const defaultCoords = { latitude: 10.762622, longitude: 106.660172 };
  const initialLat = initialAddress?.latitude ?? defaultCoords.latitude;
  const initialLng = initialAddress?.longitude ?? defaultCoords.longitude;

  const [viewport, setViewport] = useState({
    latitude: isValidCoordinate(initialLat, initialLng)
      ? initialLat
      : defaultCoords.latitude,
    longitude: isValidCoordinate(initialLat, initialLng)
      ? initialLng
      : defaultCoords.longitude,
    zoom: 18,
  });
  const [address, setAddress] = useState<AddressData>({
    fullAddress: initialAddress?.fullAddress || "",
    latitude: isValidCoordinate(initialLat, initialLng)
      ? initialLat
      : defaultCoords.latitude,
    longitude: isValidCoordinate(initialLat, initialLng)
      ? initialLng
      : defaultCoords.longitude,
    street: initialAddress?.street || "",
    ward: initialAddress?.ward || "",
    district: initialAddress?.district || "",
    city: initialAddress?.city || "",
    notes: initialAddress?.notes || "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Gọi reverse geocode khi khởi tạo
  useEffect(() => {
    if (isValidCoordinate(address.latitude, address.longitude)) {
      reverseGeocode(address.latitude, address.longitude);
    } else {
      setLoading(false);
      showToast.error("Tọa độ ban đầu không hợp lệ");
    }
  }, []);

  // Đồng bộ viewport với address
  useEffect(() => {
    if (isValidCoordinate(address.latitude, address.longitude)) {
      setViewport((prev) => ({
        ...prev,
        latitude: address.latitude,
        longitude: address.longitude,
      }));
    }
  }, [address.latitude, address.longitude]);

  // Chuyển đổi tọa độ thành địa chỉ (Goong Maps)
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!isValidCoordinate(lat, lng)) {
      showToast.error("Tọa độ không hợp lệ");
      return;
    }

    try {
      const response = await fetch(
        `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const fullAddress = result.formatted_address;

        // Phân tích các thành phần địa chỉ
        let street = "",
          ward = "",
          district = "",
          city = "";
        if (result.address_components) {
          for (const component of result.address_components) {
            // Thêm kiểm tra component.types tồn tại trước khi gọi includes
            if (component.types && component.types.includes("street")) {
              street = component.long_name;
            } else if (
              component.types &&
              component.types.includes("administrative_area_level_3")
            ) {
              ward = component.long_name;
            } else if (
              component.types &&
              component.types.includes("administrative_area_level_2")
            ) {
              district = component.long_name;
            } else if (
              component.types &&
              component.types.includes("administrative_area_level_1")
            ) {
              city = component.long_name;
            }
          }
        }

        const newAddress: AddressData = {
          fullAddress,
          latitude: lat,
          longitude: lng,
          street,
          ward,
          district,
          city,
          notes: address.notes,
        };

        setAddress(newAddress);
        onAddressChange(newAddress);
      } else {
        showToast.error("Không tìm thấy địa chỉ cho tọa độ này");
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      showToast.error("Lỗi khi lấy địa chỉ từ tọa độ");
    }
  };

  // Lấy vị trí hiện tại của người dùng
  const getCurrentLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          if (isValidCoordinate(latitude, longitude)) {
            setAddress((prev) => ({ ...prev, latitude, longitude }));
            reverseGeocode(latitude, longitude);
          } else {
            showToast.error("Tọa độ vị trí hiện tại không hợp lệ");
          }
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting current location:", error);
          setLoadingLocation(false);
          showToast.error("Không thể lấy vị trí hiện tại");
        }
      );
    } else {
      setLoadingLocation(false);
      showToast.error("Trình duyệt không hỗ trợ geolocation");
    }
  };

  // Xử lý thay đổi ghi chú
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const notes = e.target.value;
    const newAddress = { ...address, notes };
    setAddress(newAddress);
    onAddressChange(newAddress);
  };

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const fullAddress = e.target.value;
    const newAddress = { ...address, fullAddress };
    setAddress(newAddress);
    onAddressChange(newAddress);
  };
  console.log("Address:", address);

  const handleMapClick = (event: any) => {
    const lat = event.lngLat[1];
    const lng = event.lngLat[0];
    setAddress((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    reverseGeocode(lat, lng);
  };
  // Xử lý sự kiện kéo thả marker

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Chọn địa chỉ trên bản đồ</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Locate className="h-4 w-4 mr-2" />
          )}
          Vị trí hiện tại
        </Button>
      </div>

      <div className="w-full h-[300px] rounded-md border overflow-hidden relative">
        {process.env.NEXT_PUBLIC_GOONG_MAPS_KEY ? (
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="https://tiles.goong.io/assets/goong_map_web.json"
            goongApiAccessToken={process.env.NEXT_PUBLIC_GOONG_MAPS_KEY}
            onViewportChange={(newViewport: any) => setViewport(newViewport)}
            onClick={handleMapClick}
            onLoad={() => setLoading(false)}
          >
            {isValidCoordinate(address.latitude, address.longitude) && (
              <Marker
                latitude={address.latitude}
                longitude={address.longitude}
                // icon={<MapPin className="h-5 w-5 text-primary" />}
                offsetLeft={-12}
                offsetTop={-24}
                draggable
              >
                <MapPin className="h-8 w-8 text-primary" />
              </Marker>
            )}
          </ReactMapGL>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-red-500">Thiếu GOONG_MAPS_KEY</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          Địa chỉ giao hàng
        </Label>
        <Textarea
          id="address"
          value={address.fullAddress}
          onChange={handleAddressChange}
          placeholder="Địa chỉ giao hàng của bạn"
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú thêm về địa chỉ</Label>
        <Textarea
          id="notes"
          value={address.notes || ""}
          onChange={handleNotesChange}
          placeholder="Ví dụ: Tòa nhà, số tầng, số phòng, mốc địa điểm gần đó..."
          className="resize-none"
        />
      </div>
    </div>
  );
}

// Thêm Label component
const Label = ({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & {
  children: React.ReactNode;
}) => {
  return (
    <label className="text-sm font-medium text-gray-700" {...props}>
      {children}
    </label>
  );
};
