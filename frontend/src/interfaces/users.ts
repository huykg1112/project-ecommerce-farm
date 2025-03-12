import { CartItem } from "./cart_items";
import { FavoriteProduct } from "./favorite_products";
import { Inventory } from "./inventorys";
import { Product } from "./products";
import { Role } from "./roles";
import { Token } from "./tokens";

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  roles?: Role;
  Orders?: any[];
  CartItems?: CartItem[];
  favorites?: FavoriteProduct[];
  token?: Token;
  products?: Product[];
  inventory?: Inventory;
}
