export interface Store {
  id: number;
  name: string;
  type: "store" | "dealer" | "distributor";
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  lat: number;
  lng: number;
  rating: number;
  openingHours: {
    days: string;
    hours: string;
  }[];
  images: string[];
}
