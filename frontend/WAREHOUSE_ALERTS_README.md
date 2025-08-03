# Hệ thống Cảnh báo Kho hàng - Dashboard

## Tổng quan

Hệ thống cảnh báo kho hàng đã được tích hợp vào dashboard để theo dõi tình trạng sản phẩm trong kho một cách tự động.

## Các tính năng chính

### 1. API Endpoints đã tích hợp

- **`batchProductService.getExpiringSoonBatches()`**: Lấy danh sách lô sản phẩm sắp hết hạn
- **`batchProductService.getLowStockBatches()`**: Lấy danh sách sản phẩm gần hết trong kho

### 2. Components được triển khai

#### WarningAlerts (`warning-alerts.tsx`)

- Hiển thị chi tiết tất cả cảnh báo kho
- Bao gồm thông tin đầy đủ về từng loại cảnh báo
- Có khả năng xem chi tiết từng cảnh báo

#### WarehouseAlertsSummary (`warehouse-alerts-summary.tsx`)

- Hiển thị tóm tắt cảnh báo kho trong dashboard chính
- Giao diện nhỏ gọn, dễ nhìn
- Phân biệt rõ ràng giữa "sắp hết hạn" và "sắp hết hàng"

#### WarehouseAlertsDetail (`warehouse-alerts-detail.tsx`)

- Modal hiển thị chi tiết danh sách sản phẩm
- Bảng thông tin đầy đủ: tên sản phẩm, mã lô, số lượng, ngày hết hạn, v.v.
- Tính toán và hiển thị trạng thái cảnh báo

### 3. Dashboard Integration

#### Trong Dashboard Page:

```tsx
{
  /* Warning Alerts - Warehouse Monitoring */
}
<WarningAlerts warnings={dashboardData.warnings} loading={loading} />;

{
  /* Warehouse Alerts Summary trong sidebar */
}
<WarehouseAlertsSummary warnings={dashboardData.warnings} loading={loading} />;
```

#### Trong Dashboard Service:

```typescript
// Gọi API trong getDashboardData()
const [expiringSoonBatches, lowStockBatches] = await Promise.allSettled([
  batchProductService.getExpiringSoonBatches(),
  batchProductService.getLowStockBatches(),
]);

// Xử lý warnings
const warnings: WarningAlert[] = [];
if (
  expiringSoonBatches.status === "fulfilled" &&
  expiringSoonBatches.value.length > 0
) {
  warnings.push({
    id: "expiring-soon",
    type: "expiring_soon",
    title: "Sản phẩm sắp hết hạn",
    description: `${expiringSoonBatches.value.length} lô sản phẩm sắp hết hạn`,
    severity: "high",
    count: expiringSoonBatches.value.length,
    items: expiringSoonBatches.value,
  });
}
```

### 4. Loại cảnh báo được hỗ trợ

#### Sắp hết hạn (expiring_soon)

- **Mức độ**: Cao (high)
- **Icon**: Clock
- **Màu sắc**: Đỏ
- **Tiêu chí**: Sản phẩm sẽ hết hạn trong 7 ngày tới

#### Sắp hết hàng (low_stock)

- **Mức độ**: Trung bình (medium)
- **Icon**: Package
- **Màu sắc**: Vàng
- **Tiêu chí**: Số lượng tồn kho <= ngưỡng tối thiểu

### 5. Hiển thị thông tin chi tiết

Khi click "Xem chi tiết", modal sẽ hiển thị:

- Tên sản phẩm và loại sản phẩm
- Mã lô (batch number)
- Số lượng hiện tại
- Ngưỡng tối thiểu
- Ngày hết hạn (cho loại sắp hết hạn)
- Tỷ lệ tồn kho (cho loại sắp hết hàng)
- Giá bán
- Badge trạng thái với màu sắc phù hợp

### 6. Tự động cập nhật

Cảnh báo kho được cập nhật tự động khi:

- Load dashboard lần đầu
- Refresh dashboard
- Thay đổi time range (dữ liệu API được gọi lại)

### 7. Error Handling

- API calls được bọc trong Promise.allSettled để tránh crash
- Hiển thị loading state khi đang tải dữ liệu
- Hiển thị trạng thái "Không có cảnh báo" khi không có dữ liệu

## Cách sử dụng

1. **Trong Dashboard**: Cảnh báo kho tự động hiển thị trong dashboard chính
2. **Xem tóm tắt**: Check phần WarehouseAlertsSummary trong sidebar
3. **Xem chi tiết**: Click nút "Xem chi tiết" để mở modal với thông tin đầy đủ
4. **Theo dõi real-time**: Dữ liệu tự động refresh theo chu kỳ dashboard

## Technical Details

### File Structure:

```
src/components/(dashboard)/dashboard/
├── warning-alerts.tsx              // Component cảnh báo chính
├── warehouse-alerts-summary.tsx    // Component tóm tắt
└── warehouse-alerts-detail.tsx     // Modal chi tiết

src/lib_dashboard/services/
├── dashboard-service.ts            // Integration logic
└── batch-product-service.ts        // API calls

src/app/(dashboard)/dashboard/
└── page.tsx                        // Dashboard page integration
```

### Types:

```typescript
interface WarningAlert {
  id: string;
  type: "expiring_soon" | "low_stock";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  count: number;
  items: BatchProduct[];
}
```

Hệ thống cảnh báo kho hiện đã hoạt động đầy đủ và tích hợp chặt chẽ với dashboard, cung cấp thông tin quan trọng để quản lý kho hàng hiệu quả.
