"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller, FieldError } from "react-hook-form";

interface GrowthStageControllerProps {
  control: Control<any>;
  error?: FieldError;
  disabled?: boolean;
}

const growthStages = [
  { value: "mam", label: "Giai đoạn mầm" },
  { value: "ben-re", label: "Bén rễ" },
  { value: "cay-con", label: "Cây con" },
  { value: "sinh-truong", label: "Sinh trưởng" },
  { value: "ra-hoa", label: "Ra hoa" },
  { value: "ket-trai", label: "Kết trái" },
  { value: "chin", label: "Chín/Thu hoạch" },
  { value: "toan", label: "Toàn bộ thời gian" },
  { value: "khong-xac-dinh", label: "Không xác định" },
];

export function GrowthStageController({
  control,
  error,
  disabled = false,
}: GrowthStageControllerProps) {
  return (
    <div className="space-y-2">
      <Controller
        name="growthStage"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={error ? "border-red-500" : ""}>
              <SelectValue placeholder="Chọn giai đoạn sinh trưởng (tùy chọn)" />
            </SelectTrigger>
            <SelectContent>
              {growthStages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
