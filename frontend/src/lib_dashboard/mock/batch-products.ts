import type { BatchProduct } from "@/types/entities";
import { mockProductsData } from "./products";

export const mockBatchProducts: BatchProduct[] = [
  {
    batch_id: "batch1",
    product: mockProductsData[0],
    batch_number: "RU2024001",
    quantity: 150,
    manufactured_date: new Date("2024-01-15"),
    expiry_date: new Date("2026-01-15"),
    low_stock_threshold: 20,
    is_active: true,
  },
  {
    batch_id: "batch2",
    product: mockProductsData[1],
    batch_number: "IK2024001",
    quantity: 8,
    manufactured_date: new Date("2024-02-01"),
    expiry_date: new Date("2025-12-01"),
    low_stock_threshold: 15,
    is_active: true,
  },
  {
    batch_id: "batch3",
    product: mockProductsData[2],
    batch_number: "WK2024001",
    quantity: 50,
    manufactured_date: new Date("2024-03-10"),
    expiry_date: new Date("2025-09-10"),
    low_stock_threshold: 10,
    is_active: true,
  },
];
