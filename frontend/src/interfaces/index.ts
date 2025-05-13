export * from "./auths";
export * from "./cart_items";
export * from "./cart_page";
export * from "./categories";
export * from "./favorite_products";
export * from "./homes";
export * from "./inventorys";
export * from "./maps";
export * from "./permissions";
export * from "./product_detail";
export * from "./product_page";
export * from "./products";
export * from "./reviews";
export * from "./roles";
export * from "./sellers";
export * from "./stores";
export * from "./tokens";
export * from "./users";

export interface UpdateProfileDto {
  fullName?: string;
  phone?: string;
  address?: string;
  email?: string;
  lat?: number;
  lng?: number;
  cccd?: string;
  license?: string;
}
