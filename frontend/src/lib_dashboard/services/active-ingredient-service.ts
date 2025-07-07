import { ActiveIngredient } from "@/types/entities";

import { mockActiveIngredientsData } from "../mock/active-ingredients";
import {
  ActiveIngredientFilters,
  ActiveIngredientFormData,
} from "../store/active-ingredient-store";

class ActiveIngredientService {
  private data: ActiveIngredient[] = [...mockActiveIngredientsData];

  async list(filters: ActiveIngredientFilters) {
    const { search = "", status = "" } = filters;
    let result = [...this.data];

    if (search) {
      const keyword = search.toLowerCase();
      result = result.filter((c) =>
        c.ingredient_name.toLowerCase().includes(keyword)
      );
    }

    if (status === "active") result = result.filter((c) => c.is_active);
    if (status === "inactive") result = result.filter((c) => !c.is_active);

    return result;
  }

  async create(payload: ActiveIngredientFormData) {
    const newIngredient: ActiveIngredient = {
      ingredient_id: crypto.randomUUID(),
      ingredient_name: payload.ingredient_name,
      description: payload.description,
      hazard_level: payload.hazard_level,
      chemical_formula: payload.chemical_formula,
      cas_number: payload.cas_number,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.data.unshift(newIngredient);
    return newIngredient;
  }

  async update(id: string, payload: ActiveIngredientFormData) {
    this.data = this.data.map((i) =>
      i.ingredient_id === id ? { ...i, ...payload, ingredient_id: id } : i
    );
  }

  async remove(id: string) {
    this.data = this.data.filter((i) => i.ingredient_id !== id);
  }

  async toggle(id: string) {
    this.data = this.data.map((i) =>
      i.ingredient_id === id ? { ...i, is_active: !i.is_active } : i
    );
  }
}

export const activeIngredientService = new ActiveIngredientService();
