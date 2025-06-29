export type AddressType = {
  address_id: string;
  address_detail: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type UserProfileType = {
  id: string;
  username: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  cccd: string | null;
  //   license_number: string | null;
  avatar: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  role_id: string | undefined;
  role_name: string | undefined;
  addresses: AddressType[];
};
