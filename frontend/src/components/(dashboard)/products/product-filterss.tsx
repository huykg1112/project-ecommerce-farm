// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { Category } from "@/lib_dashboard/types/product";
// import { Search, X } from "lucide-react";

// interface ProductFiltersProps {
//   onFilterChange: (filters: any) => void;
//   onResetFilters: () => void;
//   categories: Category[];
// }

// export function ProductFilters({
//   onFilterChange,
//   onResetFilters,
//   categories,
// }: ProductFiltersProps) {
//   const handleSearchChange = (value: string) => {
//     onFilterChange({ search: value });
//   };

//   const handleStatusChange = (value: string) => {
//     onFilterChange({ status: value });
//   };

//   const handleCategoryChange = (value: string) => {
//     onFilterChange({ category_id: value });
//   };

//   const handleDistributorChange = (value: string) => {
//     onFilterChange({ distributor: value });
//   };

//   const clearFilters = () => {
//     onResetFilters();
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div className="flex flex-1 items-center space-x-2">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Tìm kiếm sản phẩm..."
//               onChange={(e) => handleSearchChange(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           <Select onValueChange={handleStatusChange}>
//             <SelectTrigger className="w-[140px]">
//               <SelectValue placeholder="Trạng thái" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả</SelectItem>
//               <SelectItem value="active">Đang hoạt động</SelectItem>
//               <SelectItem value="inactive">Đã khóa</SelectItem>
//             </SelectContent>
//           </Select>

//           <Select onValueChange={handleCategoryChange}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Danh mục" />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((category) => (
//                 <SelectItem
//                   key={category.category_id}
//                   value={category.category_id}
//                 >
//                   {category.category_name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select onValueChange={handleDistributorChange}>
//             <SelectTrigger className="w-[160px]">
//               <SelectValue placeholder="Nhà phân phối" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Tất cả</SelectItem>
//               {/* Add distributor options here */}
//             </SelectContent>
//           </Select>
//         </div>

//         <Button
//           variant="outline"
//           size="sm"
//           onClick={clearFilters}
//           className="h-9 px-2 lg:px-3 bg-transparent"
//         >
//           <X className="h-4 w-4" />
//           Xóa bộ lọc
//         </Button>
//       </div>
//     </div>
//   );
// }
