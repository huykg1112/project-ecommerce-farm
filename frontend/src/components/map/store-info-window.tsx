"use client";

import { Store } from "@/interfaces";
import { Star } from "lucide-react";

interface StoreInfoWindowProps {
  store: Store;
}

const StoreInfoWindow = ({ store }: StoreInfoWindowProps) => {
  return (
    <div className="p-2 max-w-[250px]">
      <h3 className="font-semibold text-sm">{store.name}</h3>
      <p className="text-xs text-muted-foreground mt-1">{store.address}</p>
      <div className="flex items-center mt-1">
        <div className="flex items-center">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(store.rating)
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
        </div>
        <span className="text-xs ml-1">{store.rating.toFixed(1)}</span>
      </div>
      <button
        className="text-xs text-blue-600 hover:text-blue-800 mt-1"
        onClick={(e) => {
          e.stopPropagation();
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`,
            "_blank"
          );
        }}
      >
        Chỉ đường
      </button>
    </div>
  );
};

export default StoreInfoWindow;
