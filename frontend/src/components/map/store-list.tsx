"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Store, StoreListProps } from "@/interfaces";

import { MapPin, Phone, Search, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const StoreList = ({
  stores,
  onStoreSelect,
  selectedStore,
  mapInstance,
  initialSearchTerm,
}: StoreListProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [filteredStores, setFilteredStores] = useState<Store[]>(stores);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    let result = stores;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(term) ||
          store.address.toLowerCase().includes(term)
      );
    }

    if (activeFilter) {
      result = result.filter((store) => store.type === activeFilter);
    }

    setFilteredStores(result);
  }, [searchTerm, activeFilter, stores]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const handleStoreHover = (store: Store) => {
    if (mapInstance) {
      mapInstance.panTo({ lat: store.lat, lng: store.lng });
    }
  };

  useEffect(() => {
    if (selectedStore && listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-store-id="${selectedStore.id}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedStore]);

  return (
    <div className="flex flex-col h-full bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm cửa hàng..."
            className="pl-10 bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {["store", "dealer", "distributor"].map((type) => (
            <Badge
              key={type}
              variant={activeFilter === type ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 ${
                activeFilter === type
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilterClick(type)}
            >
              {type === "store"
                ? "Cửa hàng"
                : type === "dealer"
                ? "Đại lý"
                : "Nhà phân phối"}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredStores.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không tìm thấy cửa hàng nào
          </div>
        ) : (
          <ul ref={listRef} className="divide-y divide-gray-100">
            {filteredStores.map((store) => (
              <li
                key={store.id}
                data-store-id={store.id}
                className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                  selectedStore?.id === store.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onStoreSelect(store)}
                onMouseEnter={() => handleStoreHover(store)}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {store.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-xs border-gray-300 text-gray-600"
                  >
                    {store.type === "store"
                      ? "Cửa hàng"
                      : store.type === "dealer"
                      ? "Đại lý"
                      : "Nhà phân phối"}
                  </Badge>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(store.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-xs ml-1 text-gray-700">
                      {store.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Phone className="h-4 w-4 mr-1 text-green-500" />
                    <span>{store.phone}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StoreList;
