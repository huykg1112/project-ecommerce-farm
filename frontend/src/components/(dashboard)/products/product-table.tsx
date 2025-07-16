// "use client";

// import { Badge } from "@/components/ui/badge";
// import { useProducts } from "@/hooks/use-products";
// import { Product } from "@/lib_dashboard/types/product";
// import { useState } from "react";
// import DataTable, { TableColumn } from "react-data-table-component";

// interface ProductTableProps {
//   products: Product[];
//   loading: boolean;
// }

// export function ProductTable({ products, loading }: ProductTableProps) {
//   const {
//     selectedProducts,
//     toggleProductSelection,
//     selectAllProducts,
//     clearSelection,
//     openEditModal,
//     openLockModal,
//     deleteProduct,
//   } = useProducts();

//   const [sortField, setSortField] = useState<keyof Product>("created_at");
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

//   const handleSort = (field: keyof Product) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortDirection("asc");
//     }
//   };

//   const handleSelectAll = () => {
//     if (selectedProducts.length === products.length) {
//       clearSelection();
//     } else {
//       selectAllProducts();
//     }
//   };

//   const handleDelete = async (productId: string) => {
//     if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
//       await deleteProduct(productId);
//     }
//   };

//   const getStatusBadge = (isActive: boolean) => {
//     return (
//       <Badge
//         variant={isActive ? "default" : "secondary"}
//         className="font-medium"
//       >
//         {isActive ? "Hoạt động" : "Đã khóa"}
//       </Badge>
//     );
//   };

//   const columns: TableColumn<Product>[] = [
//     {
//       name: "Hình ảnh",
//       selector: (row) =>
//         row.images.find((img) => img.is_primary)?.image_url || "",
//       cell: (row) => (
//         <img
//           src={
//             row.images.find((img) => img.is_primary)?.image_url ||
//             "/placeholder.svg"
//           }
//           alt={row.product_name}
//           className="h-10 w-10 rounded-lg"
//         />
//       ),
//     },
//     {
//       name: "Tên sản phẩm",
//       selector: (row) => row.product_name,
//       sortable: true,
//     },
//     {
//       name: "Giá",
//       selector: (row) => row.unit_product_price,
//       sortable: true,
//       cell: (row) => <span>{row.unit_product_price.toLocaleString()} VND</span>,
//     },
//     {
//       name: "Danh mục",
//       selector: (row) =>
//         row.categories.map((cat) => cat.category_name).join(", "),
//       cell: (row) => (
//         <div className="flex flex-wrap gap-1">
//           {row.categories.map((cat) => (
//             <span key={cat.category_id} className="badge">
//               {cat.category_name}
//             </span>
//           ))}
//         </div>
//       ),
//     },
//     {
//       name: "Nhà phân phối",
//       selector: (row) => row.distributor?.invenstory?.name || "",
//     },
//     {
//       name: "Trạng thái",
//       selector: (row) => row.is_active,
//       cell: (row) => (
//         <span className={row.is_active ? "text-green-600" : "text-red-600"}>
//           {row.is_active ? "Hoạt động" : "Không hoạt động"}
//         </span>
//       ),
//     },
//   ];

//   const expandableRowsComponent = ({ data }: { data: Product }) => (
//     <div className="p-4">
//       <p>
//         <strong>Mô tả:</strong> {data.description || "Không có mô tả"}
//       </p>
//       <p>
//         <strong>Hướng dẫn sử dụng:</strong>{" "}
//         {data.usage_instructions || "Không có hướng dẫn"}
//       </p>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="rounded-md border">
//         <DataTable
//           columns={columns}
//           data={Array.from({ length: 5 })}
//           progressPending={true}
//           pagination
//           paginationPerPage={10}
//           paginationRowsPerPageOptions={[10, 20, 30]}
//           expandableRows
//           expandableRowsComponent={expandableRowsComponent}
//         />
//       </div>
//     );
//   }

//   return (
//     <DataTable
//       columns={columns}
//       data={products}
//       progressPending={loading}
//       pagination
//       paginationPerPage={10}
//       paginationRowsPerPageOptions={[10, 20, 30]}
//       expandableRows
//       expandableRowsComponent={expandableRowsComponent}
//     />
//   );
// }
