import { InvenstoryClient } from "@/lib_dashboard/types/product";

export interface GoongMapComponentProps {
  inventories: InvenstoryClient[];
  selectedInventory: InvenstoryClient | null;
  onStoreSelect: (inventory: InvenstoryClient) => void;
  onLoad?: (map: any) => void;
}

export interface InventoryDetailProps {
  inventory: InvenstoryClient;
  onClose: () => void;
}

export interface StoreListProps {
  inventories: InvenstoryClient[];
  onStoreSelect: (inventory: InvenstoryClient) => void;
  selectedInventory: InvenstoryClient | null;
  mapInstance?: any | null;
  initialSearchTerm?: string;
}
