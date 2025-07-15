export interface Manufacturer {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  isDeleted: boolean;
  //   products?: Product[];
}

export interface CreateManufacturerRequest {
  name: string;
  description?: string;
  logo?: string;
}

export interface UpdateManufacturerRequest {
  name?: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}
