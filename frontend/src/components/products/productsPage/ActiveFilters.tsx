import { Button } from "@/components/ui/button";

interface ActiveFiltersProps {
  activeFilters: JSX.Element[];
  clearAllFilters: () => void;
  isMobile?: boolean;
}

export default function ActiveFilters({
  activeFilters,
  clearAllFilters,
  isMobile = false,
}: ActiveFiltersProps) {
  return (
    <div
      className={`${
        isMobile ? "flex" : "hidden md:flex"
      } flex-wrap items-center mb-4`}
    >
      <span className="text-sm font-medium mr-2">
        {isMobile ? "Bộ lọc:" : "Bộ lọc đang áp dụng:"}
      </span>
      {activeFilters}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs h-7"
        onClick={clearAllFilters}
      >
        Xóa tất cả
      </Button>
    </div>
  );
}
// Component cho phần hiển thị các bộ lọc đang áp dụng. Có thể xóa tất cả bộ lọc
