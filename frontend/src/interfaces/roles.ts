import { Permission } from "./permissions";

export interface Role {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  permissions?: Permission[];
}
