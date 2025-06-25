import { Permission } from "./permissions";

export interface Role {
  role_id: string;
  role_name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
  permissions?: Permission[];
}
