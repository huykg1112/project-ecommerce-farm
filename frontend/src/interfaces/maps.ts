import { Store } from "./stores";

export interface GoogleMapComponentProps {
  stores: Store[];
  selectedStore: Store | null;
  onStoreSelect: (store: Store) => void;
  onLoad?: (map: google.maps.Map) => void;
}

export interface StoreDetailProps {
  store: Store;
  onClose: () => void;
}
export interface StoreListProps {
  stores: Store[];
  onStoreSelect: (store: Store) => void;
  selectedStore: Store | null;
  mapInstance?: google.maps.Map | null;
  initialSearchTerm?: string;
}
