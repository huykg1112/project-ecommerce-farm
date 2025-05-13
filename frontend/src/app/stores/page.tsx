"use client";

import GoongMapComponent from "@/components/map/goong-map";
import StoreDetail from "@/components/map/store-detail";
import StoreList from "@/components/map/store-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { stores } from "@/data/stores";
import { Store } from "@/interfaces";
import { List, MapPin } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function StoresPage() {
  const searchParams = useSearchParams();
  const initialSearchTerm = searchParams.get("searchStores") || "";
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showList, setShowList] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setShowDetail(true);
    if (window.innerWidth < 768) {
      setShowList(false);
    }
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
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

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 h-[70vh]">
        <div
          className={`md:block ${
            showList ? "block" : "hidden"
          } md:col-span-1 border rounded-lg overflow-hidden`}
        >
          <StoreList
            stores={stores}
            onStoreSelect={handleStoreSelect}
            selectedStore={selectedStore}
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
            stores={stores}
            selectedStore={selectedStore}
            onStoreSelect={handleStoreSelect}
            onLoad={(map) => setMapInstance(map)}
          />
        </div>
      </div>

      <Sheet open={showDetail} onOpenChange={setShowDetail}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0">
          {selectedStore && (
            <StoreDetail store={selectedStore} onClose={handleCloseDetail} />
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
