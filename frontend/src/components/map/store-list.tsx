"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StoreListProps } from "@/interfaces";
import { InvenstoryClient } from "@/lib_dashboard/types/product";

import { MapPin, Phone, Search, Star } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const StoreList = ({
  inventories,
  onStoreSelect,
  selectedInventory,
  mapInstance,
  initialSearchTerm,
}: StoreListProps) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [filteredInventories, setFilteredInventories] =
    useState<InvenstoryClient[]>(inventories);
  const listRef = useRef<HTMLUListElement>(null);

  // Calculate rating for inventory
  const calculateInventoryRating = useCallback(
    (inventory: InvenstoryClient): number => {
      if (!inventory.batch_products || inventory.batch_products.length === 0) {
        return 0;
      }

      const productRatings: number[] = [];

      // Get unique products from batch_products
      const uniqueProducts = inventory.batch_products
        .map((batch) => batch.product)
        .filter(
          (product, index, self) =>
            index === self.findIndex((p) => p.product_id === product.product_id)
        );

      uniqueProducts.forEach((product) => {
        if (product.reviews && product.reviews.length > 0) {
          const ratingsWithValue = product.reviews
            .filter((review) => review.rating != null && review.rating > 0)
            .map((review) => review.rating!);

          if (ratingsWithValue.length > 0) {
            const avgRating =
              ratingsWithValue.reduce((sum, rating) => sum + rating, 0) /
              ratingsWithValue.length;
            if (avgRating > 0) {
              productRatings.push(avgRating);
            }
          }
        }
      });

      if (productRatings.length === 0) return 0;

      return (
        productRatings.reduce((sum, rating) => sum + rating, 0) /
        productRatings.length
      );
    },
    []
  );

  useEffect(() => {
    let result = inventories;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (inventory) =>
          inventory.name?.toLowerCase().includes(term) ||
          inventory.distributor.full_name?.toLowerCase().includes(term) ||
          inventory.invenstory_address?.toLowerCase().includes(term)
      );
    }

    setFilteredInventories(result);
  }, [searchTerm, inventories]);
  useEffect(() => {
    if (selectedInventory && listRef.current) {
      const selectedElement = listRef.current.querySelector(
        `[data-inventory-id="${selectedInventory.invenstory_id}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedInventory]);

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
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredInventories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Không tìm thấy cửa hàng nào
          </div>
        ) : (
          <ul ref={listRef} className="divide-y divide-gray-100">
            {filteredInventories.map((inventory) => {
              const rating = calculateInventoryRating(inventory);
              const storeName =
                inventory.name || inventory.distributor.full_name || "Cửa hàng";
              const storeAddress =
                inventory.invenstory_address || "Chưa có địa chỉ";
              const storePhone =
                inventory.distributor.phone_number || "Chưa có số điện thoại";

              return (
                <li
                  key={inventory.invenstory_id}
                  data-inventory-id={inventory.invenstory_id}
                  className={`p-4 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                    selectedInventory?.invenstory_id === inventory.invenstory_id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => onStoreSelect(inventory)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-sm text-gray-800">
                      {storeName}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs border-gray-300 text-gray-600"
                    >
                      Cửa hàng
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{storeAddress}</span>
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
                                i < Math.floor(rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-700">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Phone className="h-4 w-4 mr-1 text-green-500" />
                      <span>{storePhone}</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StoreList;
