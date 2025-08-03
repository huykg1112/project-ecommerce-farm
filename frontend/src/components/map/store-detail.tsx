"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryDetailProps } from "@/interfaces";
import { Mail, MapPin, Navigation, Phone, Star, StoreIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const StoreDetail = ({ inventory, onClose }: InventoryDetailProps) => {
  const router = useRouter();

  console.log("StoreDetail inventory:", inventory);

  // Calculate average rating for this inventory
  const inventoryRating = useMemo(() => {
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
  }, [inventory.batch_products]);

  const handleGetDirections = () => {
    const lat = parseFloat(inventory.invenstory_lat || "16.047079");
    const lng = parseFloat(inventory.invenstory_lng || "108.20623");
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  const handleGetDetailSeller = () => {
    router.push(`/seller/${inventory.distributor.user_id}`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold">Chi tiết cửa hàng</h2>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          <img
            src={
              inventory.invenstory_img ||
              "/placeholder.svg?height=200&width=400"
            }
            alt={inventory.name || inventory.distributor.full_name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {inventory.name || inventory.distributor.full_name}
            </h3>
            <Badge>Cửa hàng</Badge>
          </div>

          <div className="flex items-center mt-1">
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(inventoryRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
            </div>
            <span className="ml-1">{inventoryRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
            <span>{inventory.invenstory_address || "Chưa có địa chỉ"}</span>
          </div>

          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
            <a
              href={`tel:${inventory.distributor.phone_number}`}
              className="hover:underline"
            >
              {inventory.distributor.phone_number || "Chưa có số điện thoại"}
            </a>
          </div>

          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
            <a
              href={`mailto:${inventory.email || inventory.distributor.email}`}
              className="hover:underline"
            >
              {inventory.email ||
                inventory.distributor.email ||
                "Chưa có email"}
            </a>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <strong>Mô tả:</strong> Cửa hàng thuộc sở hữu của{" "}
              {inventory.distributor.full_name}
            </p>
            {inventory.business_license && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Giấy phép kinh doanh:</strong>{" "}
                {inventory.business_license}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex gap-4">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-400"
          onClick={handleGetDetailSeller}
        >
          <StoreIcon className="h-4 w-4" /> Đến cửa hàng
        </Button>
        <Button className="w-full" onClick={handleGetDirections}>
          <Navigation className="h-4 w-4" />
          Chỉ đường
        </Button>
      </div>
    </div>
  );
};

export default StoreDetail;
