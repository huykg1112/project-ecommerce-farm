import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/types/products";

interface SortSelectProps {
  sort: SortOption;
  setSort: (value: SortOption) => void;
  width?: string;
}

export default function SortSelect({
  sort,
  setSort,
  width = "w-[200px]",
}: SortSelectProps) {
  return (
    <Select
      value={sort}
      onValueChange={(value) => setSort(value as SortOption)}
    >
      <SelectTrigger className={width}>
        <SelectValue placeholder="Sắp xếp" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Nổi bật</SelectItem>
        <SelectItem value="newest">Mới nhất</SelectItem>
        <SelectItem value="price-low-high">Giá: Thấp đến cao</SelectItem>
        <SelectItem value="price-high-low">Giá: Cao đến thấp</SelectItem>
        <SelectItem value="rating">Đánh giá cao</SelectItem>
      </SelectContent>
    </Select>
  );
}

// Component cho phần chọn sắp xếp sản phẩm
