"use client";

import GoongMapComponent from "@/components/map/goong-map";
import StoreDetail from "@/components/map/store-detail";
import StoreList from "@/components/map/store-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { inventoryServiceManagement } from "@/lib_dashboard/services/invenstory-service-management";
import { InvenstoryClient } from "@/lib_dashboard/types/product";
import { List, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function StoresPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get("searchStores") || "";
  const [selectedInventory, setSelectedInventory] =
    useState<InvenstoryClient | null>(null);
  const [showList, setShowList] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [inventories, setInventories] = useState<InvenstoryClient[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to calculate average rating for an inventory
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

  // Fetch inventories data
  const fetchInventories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await inventoryServiceManagement.getInventoryForUser();
      setInventories(data);
    } catch (error) {
      console.error("Error fetching inventories:", error);
      setInventories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventories();
  }, [fetchInventories]);

  const handleStoreSelect = (inventory: InvenstoryClient) => {
    setSelectedInventory(inventory);
    setShowDetail(true);
    if (window.innerWidth < 768) {
      setShowList(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedInventory(null);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cửa hàng & Đại lý</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <span>/</span>
            <span>Cửa hàng & Đại lý</span>
          </div>
        </div>
        <div className="md:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowList(!showList)}
          >
            {showList ? (
              <MapPin className="h-4 w-4 mr-2" />
            ) : (
              <List className="h-4 w-4 mr-2" />
            )}
            {showList ? "Xem bản đồ" : "Xem danh sách"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách cửa hàng...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[70vh]">
          <div
            className={`md:block ${
              showList ? "block" : "hidden"
            } md:col-span-1 border rounded-lg overflow-hidden`}
          >
            <StoreList
              inventories={inventories}
              onStoreSelect={handleStoreSelect}
              selectedInventory={selectedInventory}
              mapInstance={mapInstance}
              initialSearchTerm={initialSearchTerm}
            />
          </div>

          <div
            className={`${
              showList ? "hidden" : "block"
            } md:block md:col-span-2 lg:col-span-3 border rounded-lg overflow-hidden`}
          >
            <GoongMapComponent
              inventories={inventories}
              selectedInventory={selectedInventory}
              onStoreSelect={handleStoreSelect}
              onLoad={(map) => setMapInstance(map)}
            />
          </div>
        </div>
      )}

      <Sheet open={showDetail} onOpenChange={setShowDetail}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          {selectedInventory && (
            <StoreDetail
              inventory={selectedInventory}
              onClose={handleCloseDetail}
            />
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
