import { cn } from "@/lib/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-md border border-input bg-background px-4 py-3 text-base ring-offset-background", // Tăng h-10 lên h-12, px-3 lên px-4, py-2 lên py-3
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#599146] focus-visible:ring-offset-2", // Thay ring mặc định bằng #599146, xóa viền đen
          "disabled:cursor-not-allowed disabled:opacity-50",
          "md:text-base", // Tăng từ md:text-sm lên md:text-base
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
