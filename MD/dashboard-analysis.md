# Phân tích Kiến trúc Dashboard Frontend

## Tổng quan hệ thống

Frontend Dashboard được xây dựng bằng **Next.js 14** với **TypeScript**, sử dụng **App Router** và các công nghệ hiện đại như **Tailwind CSS**, **Jotai** cho state management, và **shadcn/ui** cho component library.

## Cấu trúc thư mục chính

```
frontend/src/
├── app/
│   ├── (dashboard)/          # Dashboard routes (route groups)
│   │   ├── layout.tsx        # Dashboard layout wrapper
│   │   ├── products-management/
│   │   ├── users-management/
│   │   └── ...
│   └── layout.tsx            # Root layout
├── lib_dashboard/            # Dashboard-specific logic
│   ├── store/               # Jotai atoms (state management)
│   ├── services/            # API services
│   ├── types/               # TypeScript interfaces
│   └── utils/               # Utility functions
├── components/
│   ├── (dashboard)/         # Dashboard-specific components
│   ├── ui/                  # Reusable UI components
│   └── common/              # Common components
├── hooks/                   # Custom React hooks
└── layouts/                 # Layout components
```

## 1. Kiến trúc Layout Dashboard

### Layout Hierarchy
```
RootLayout
└── DashboardLayout
    ├── Providers (Context providers)
    ├── SidebarProvider
    ├── AppSidebar (Navigation)
    ├── DashboardHeader (Top bar)
    └── Main Content Area
```

### Dashboard Layout (`app/(dashboard)/layout.tsx`)
```typescript
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col w-0">
            <DashboardHeader />
            <main className="flex-1 p-6 bg-[#f9f9f9]">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </Providers>
  );
}
```

### AppSidebar - Navigation Structure
- **Collapsible menu groups** với icon và submenu
- **4 nhóm chính:**
  - **Tổng quan**: Dashboard, Thống kê người dùng
  - **Quản lý người dùng**: Người dùng, Duyệt đại lý
  - **Quản lý sản phẩm**: Sản phẩm, Danh mục, Hoạt chất, Bệnh, Nhà sản xuất
  - **Quản lý hoạt động**: Đơn hàng, Kho, Voucher, Khuyến mãi

### DashboardHeader - Top Navigation
- **Sidebar toggle button**
- **Search bar** (tìm kiếm toàn cục)
- **Notification bell** với badge
- **User authentication section**

## 2. Lib_Dashboard - Core Logic Layer

### Store Management (Jotai Atoms)

#### Atom Categories
```typescript
// 📊 CORE DATA ATOMS
productsDataAtom          // Main products data
productPaginationAtom     // Pagination info
productsLoadingAtom       // Loading states
selectedProductAtom       // Selected product

// 🔍 FILTER & SEARCH ATOMS
productFiltersAtom        // Basic filters
advancedFiltersAtom       // Advanced search
searchHistoryAtom         // Search history

// 🏢 DISTRIBUTOR-SPECIFIC ATOMS
myProductsAtom           // Distributor's products
myProductStatsAtom       // Product statistics
productFormDataAtom      // Form data
selectedProductsAtom     // Batch selection

// 🎨 UI STATE ATOMS
productViewModeAtom      // Table/Grid/List view
productTableColumnsAtom  // Column visibility
addProductModalAtom      // Modal states
```

#### Derived Atoms (Computed Values)
```typescript
// Client-side filtering
const filteredProductsAtom = atom((get) => {
  const products = get(productsDataAtom);
  const filters = get(productFiltersAtom);
  
  // Apply search, status, category, price filters
  // Apply sorting
  return filtered;
});

// Selection helpers
const isAllProductsSelectedAtom = atom((get) => {
  const products = get(productsDataAtom);
  const selected = get(selectedProductsAtom);
  return products.length > 0 && selected.length === products.length;
});
```

### Service Layer (API Integration)

#### Product Service Structure
```typescript
export const productServiceManagement = {
  // CRUD Operations
  async getProducts(filters?: ProductFilters): Promise<ProductPaginationResponse>
  async getProductById(id: string): Promise<Product>
  async getMyProducts(): Promise<Product[]>
  async createProduct(data: CreateProductRequest): Promise<Product>
  async updateProduct(id: string, data: UpdateProductRequest): Promise<Product>
  async deleteProduct(id: string): Promise<void>
  
  // Status Management
  async toggleProductStatus(id: string): Promise<Product>
  async batchToggleStatus(request: BatchToggleStatusRequest): Promise<BatchOperationResponse>
  async batchDeleteProducts(request: BatchProductRequest): Promise<BatchOperationResponse>
  
  // Statistics
  async getMyProductStats(): Promise<ProductStatsResponse>
  async getProductStats(distributorId?: string): Promise<ProductStatsResponse>
  
  // Search & Filter
  async advancedSearch(filters: AdvancedProductFilterRequest): Promise<Product[]>
};
```

### Type System

#### Core Product Interface
```typescript
interface Product {
  product_id: string;
  product_name: string;
  description?: string;
  usage_instructions?: string;
  unit_product_price: number;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
  categories: ProductCategory[];
  manufacturer?: ProductManufacturer;
  distributor?: ProductDistributor;
  images: ProductImage[];
  reviews: ProductReview[];
  avg_rating: number | null;
  product_ingredients: ProductIngredient[];
  diseases: ProductDisease[];
}
```

#### Filter & Request Types
```typescript
interface ProductFilters {
  search?: string;
  category_id?: string;
  manufacturer_id?: string;
  distributor_id?: string;
  status?: "all" | "active" | "inactive";
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  rating_max?: number;
  sort_by?: "name" | "price" | "rating" | "created_at";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
```

## 3. Custom Hooks Pattern

### useProductManagement Hook
```typescript
export const useProductManagement = () => {
  // === DIRECT ATOM ACCESS ===
  const myProducts = useAtomValue(myProductsAtom);
  const myProductsLoading = useAtomValue(myProductsLoadingAtom);
  const selectedProducts = useAtomValue(selectedProductsAtom);
  
  // === ACTIONS ===
  const [, fetchMyProducts] = useAtom(fetchMyProductsAtom);
  const [, createProduct] = useAtom(createProductAtom);
  const [, updateProduct] = useAtom(updateProductAtom);
  
  // === MANAGEMENT FUNCTIONS ===
  const getMyProducts = useCallback(async () => {
    return await fetchMyProducts();
  }, [fetchMyProducts]);
  
  const updateProductFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    updateFilters(newFilters);
  }, [updateFilters]);
  
  return {
    // Data states
    myProducts,
    myProductsLoading,
    selectedProducts,
    
    // Query functions
    getMyProducts,
    
    // Filter functions
    updateProductFilters,
    
    // Management functions
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Modal functions
    openAddModal,
    openEditModal,
    closeModals,
  };
};
```

## 4. Component Architecture

### Page Component Structure
```typescript
export default function ProductsManagementPage() {
  const {
    myProducts,
    myProductsLoading,
    selectedProducts,
    getMyProducts,
    updateProductFilters,
    createProduct,
    // ... other hooks
  } = useProductManagement();
  
  // Handler functions
  const handleSearchChange = useCallback((search: string) => {
    updateProductFilters({ search, page: 1 });
  }, [updateProductFilters]);
  
  const handleCreateProduct = useCallback(async () => {
    try {
      await createProduct(productFormData);
      await getMyProducts();
      closeModals();
      return true;
    } catch (error) {
      return false;
    }
  }, [createProduct, productFormData, getMyProducts, closeModals]);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <h1>🌾 Quản lý sản phẩm</h1>
        <Button onClick={handleOpenAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>
      
      {/* Statistics Cards */}
      <StatisticsCards stats={stats} />
      
      {/* Filters */}
      <ProductFilters
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onReset={resetProductFilters}
      />
      
      {/* Batch Actions */}
      <BatchActions
        selectedCount={getSelectedCount()}
        onBatchDelete={handleBatchDelete}
      />
      
      {/* Data Table */}
      <ProductTable
        products={myProducts}
        selectedProducts={selectedProducts}
        onSelectProduct={toggleProductSelection}
        onEditProduct={handleEditProduct}
        loading={myProductsLoading}
      />
      
      {/* Pagination */}
      <ProductPagination
        currentPage={filters.page || 1}
        onPageChange={handlePageChange}
      />
      
      {/* Modals */}
      <ProductFormModal
        open={addProductModal}
        onSubmit={handleCreateProduct}
      />
    </div>
  );
}
```

### Reusable Components

#### ProductTable Component
```typescript
interface ProductTableProps {
  products: Product[];
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: (checked: boolean) => void;
  onToggleStatus: (productId: string) => void;
  onViewDetails: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  loading: boolean;
}

export function ProductTable({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  // ... other props
}: ProductTableProps) {
  // Table rendering with selection, actions, status badges
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
          </TableHead>
          <TableHead>Hình ảnh</TableHead>
          <TableHead>Tên sản phẩm</TableHead>
          <TableHead>Giá</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.product_id}>
            {/* Table cells with data and actions */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

#### ProductFilters Component
```typescript
interface ProductFiltersProps {
  search: string;
  category_id: string;
  status: string;
  price_min?: number;
  price_max?: number;
  onSearchChange: (search: string) => void;
  onCategoryChange: (category_id: string) => void;
  onStatusChange: (status: string) => void;
  onPriceRangeChange: (priceRange: { min?: number; max?: number }) => void;
  onReset: () => void;
}

export function ProductFilters({
  search,
  category_id,
  status,
  onSearchChange,
  onCategoryChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Bộ lọc sản phẩm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div>
            <Label>Tìm kiếm</Label>
            <Input
              placeholder="Nhập tên sản phẩm..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Category Select */}
          <div>
            <Label>Danh mục</Label>
            <Select value={category_id} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Reset Button */}
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 5. Patterns và Best Practices

### State Management Pattern
- **Atomic State**: Mỗi atom chỉ chứa một phần dữ liệu cụ thể
- **Derived State**: Sử dụng computed atoms cho logic phức tạp
- **Action Atoms**: Tách biệt logic xử lý khỏi UI components
- **Loading States**: Quản lý loading state cho từng operation

### Component Patterns
- **Container/Presentation**: Page components làm container, UI components làm presentation
- **Custom Hooks**: Tách logic business ra khỏi components
- **Compound Components**: Chia nhỏ components phức tạp thành các parts
- **Render Props**: Sử dụng callback patterns cho flexibility

### Error Handling Pattern
```typescript
try {
  await createProduct(productFormData);
  await getMyProducts();
  closeModals();
  showToast.success("Tạo sản phẩm thành công!");
  return true;
} catch (error) {
  showToast.error("Không thể tạo sản phẩm");
  return false;
}
```

### Loading States Pattern
```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitAction();
  } finally {
    setLoading(false);
  }
};
```

## 6. UI/UX Design System

### Color Palette
```css
--primary-green: #44703d;      /* Dark green */
--secondary-green: #74a65d;    /* Medium green */
--accent-green: #90c577;       /* Light green */
--background-green: #accc8b;   /* Very light green */
--surface: #f9f9f9;            /* Background */
```

### Component Library
- **shadcn/ui**: Base components (Button, Input, Table, etc.)
- **Lucide Icons**: Consistent icon system
- **Tailwind CSS**: Utility-first styling
- **Custom components**: Dashboard-specific components

### Responsive Design
- **Mobile-first approach**
- **Breakpoint system**: sm, md, lg, xl
- **Flexible layouts**: Grid và Flexbox
- **Collapsible sidebar** cho mobile

## 7. Performance Optimizations

### React Optimizations
- **useCallback**: Memoize event handlers
- **useMemo**: Memoize expensive computations
- **React.memo**: Prevent unnecessary re-renders
- **Code splitting**: Dynamic imports cho pages

### State Management Optimizations
- **Selective subscriptions**: Chỉ subscribe atoms cần thiết
- **Derived atoms**: Tính toán client-side thay vì server calls
- **Batch updates**: Nhóm multiple state updates

### Network Optimizations
- **Request deduplication**: Tránh duplicate API calls
- **Optimistic updates**: Update UI trước khi API response
- **Error boundaries**: Graceful error handling

## 8. Security Considerations

### Authentication & Authorization
```typescript
// Middleware for protected routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

### Input Validation
- **Client-side validation**: Immediate feedback
- **Server-side validation**: Security và data integrity
- **XSS protection**: Sanitize user inputs
- **CSRF protection**: Token-based protection

## 9. Testing Strategy

### Unit Testing
- **Component testing**: React Testing Library
- **Hook testing**: Custom hooks testing
- **Utility testing**: Pure functions testing

### Integration Testing
- **API integration**: Mock API responses
- **State management**: Test atom interactions
- **User flows**: End-to-end scenarios

## 10. Deployment & DevOps

### Build Process
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment Configuration
- **Development**: Local development setup
- **Staging**: Pre-production testing
- **Production**: Optimized build với caching

## Kết luận

Dashboard được xây dựng theo **modern React patterns** với:

### Điểm mạnh:
- **Kiến trúc module rõ ràng** với separation of concerns
- **State management hiệu quả** với Jotai atoms
- **Type safety** với TypeScript
- **Reusable components** và consistent design
- **Performance optimizations** và error handling tốt
- **Responsive design** cho tất cả devices

### Khả năng mở rộng:
- **Dễ dàng thêm modules mới** theo pattern có sẵn
- **Scalable state management** với atomic approach
- **Flexible component system** cho customization
- **Maintainable codebase** với clear structure

Hệ thống này cung cấp một foundation mạnh mẽ cho việc xây dựng các trang quản lý phức tạp với user experience tốt và developer experience thuận tiện.