# Hệ thống Xuất Báo cáo Chuyên nghiệp

## Tổng quan

Hệ thống xuất báo cáo chuyên nghiệp cho dashboard và quản lý lô sản phẩm với các định dạng PDF và Excel, bao gồm các tính năng:

- 📊 Xuất báo cáo dashboard tổng quan
- 📦 Xuất báo cáo lô sản phẩm chi tiết
- ⚠️ Xuất báo cáo cảnh báo kho hàng
- 🎨 Template chuyên nghiệp với màu sắc nông nghiệp
- ⚙️ Tùy chọn nội dung linh hoạt

## Cấu trúc Files

### Export Service (`export-service.ts`)

```typescript
// Core service xử lý xuất báo cáo
-exportDashboardToPDF() - // Xuất dashboard PDF
  exportDashboardToExcel() - // Xuất dashboard Excel
  exportWarehouseAlertsToPDF(); // Xuất cảnh báo kho PDF
```

### Export Components

#### 1. ExportReportModal (`export-report-modal.tsx`)

**Dashboard Export Component**

- Modal tùy chọn xuất báo cáo dashboard
- ExportDropdown cho quick export
- Switch options cho nội dung

#### 2. BatchProductExport (`batch-product-export.tsx`)

**Batch Products Export Component**

- Modal xuất báo cáo lô sản phẩm
- BatchProductExportButton
- Filtering options

## Tính năng Dashboard Export

### PDF Dashboard Report

✅ **Header Section**

- Tiêu đề: "BÁO CÁO DASHBOARD NÔNG NGHIỆP"
- Thời gian và ngày xuất
- Màu sắc agricultural green (#44703d)

✅ **Thống kê tổng quan**

- Tổng người dùng, người dùng mới
- Tổng nhà phân phối, nhà phân phối mới
- Tổng đơn hàng và doanh thu
- Format table với màu header xanh

✅ **Cảnh báo kho hàng** (nếu có)

- Loại cảnh báo, mô tả, mức độ
- Số lượng sản phẩm affected
- Color coding theo severity

✅ **Dữ liệu doanh thu**

- Chart data theo time periods
- Format currency đẹp mắt
- Table responsive

✅ **Phân bố người dùng**

- Số lượng và tỷ lệ % theo role
- Tính toán percentage chính xác

✅ **Footer**

- Pagination: "Trang X / Y"
- Brand: "Hệ thống quản lý nông nghiệp - FARME"

### Excel Dashboard Report

✅ **Multiple Sheets Structure**

- **Tổng quan**: Summary statistics
- **Doanh thu**: Revenue data với time periods
- **Phân bố người dùng**: User distribution với %
- **Cảnh báo kho**: Warnings summary
- **Chi tiết X**: Detailed warning items
- **Hoạt động**: Recent activities

✅ **Data Formatting**

- Header styling với bold
- Proper number formatting
- Date formatting (dd/MM/yyyy)
- Currency values

## Tính năng Batch Products Export

### PDF Batch Report

✅ **Statistics Overview**

- Tổng lô sản phẩm
- Lô đang hoạt động
- Lô sắp hết hạn (7 ngày)
- Lô sắp hết hàng

✅ **Detailed Table**

- Mã lô, tên sản phẩm (truncated)
- Số lượng, ngưỡng tối thiểu
- Ngày hết hạn (dd/MM/yy)
- Giá bán (formatted)
- Trạng thái hoạt động

✅ **Smart Pagination**

- Auto page breaks
- Consistent headers
- Footer với page numbers

### Excel Batch Report

✅ **Multi-Sheet Structure**

- **Tổng quan**: Statistics summary
- **Chi tiết**: Full batch product data
- **Sắp hết hạn**: Expiring products with days left
- **Sắp hết hàng**: Low stock với % remaining

✅ **Advanced Data**

- Full product names (không truncate)
- Ngày sản xuất + hết hạn
- Loại sản phẩm, kho
- Calculated fields (days left, stock %)

## Export Options

### Dashboard Export Options

```typescript
interface ExportOptions {
  format: "pdf" | "excel";
  includeCharts?: boolean; // Bao gồm dữ liệu biểu đồ
  includeWarnings?: boolean; // Bao gồm cảnh báo kho
  includeActivities?: boolean; // Bao gồm hoạt động gần đây
}
```

### Batch Export Options

```typescript
interface BatchProductExportOptions {
  includeExpired?: boolean; // Lô sắp hết hạn
  includeLowStock?: boolean; // Lô sắp hết hàng
  includeInactive?: boolean; // Lô đã tạm dừng
}
```

## UI/UX Features

### Export Modal

- **Toggle Switches**: Dễ dàng bật/tắt options
- **Preview Count**: "Số lô sẽ xuất: X / Y"
- **Format Selection**: PDF vs Excel với icon và mô tả
- **Quick Actions**: Dropdown với export nhanh

### Loading States

- Disable buttons during export
- Loading spinners
- Toast notifications success/error

### Error Handling

- Try-catch cho tất cả export functions
- Meaningful error messages
- Console logging cho debugging

## Integration trong Pages

### Dashboard Page

```tsx
import { ExportDropdown } from "@/components/(dashboard)/dashboard/export-report-modal";

// In header actions
<ExportDropdown dashboardData={dashboardData} timeRange={timeRange} />;
```

### Batch Products Page

```tsx
import { BatchProductExportButton } from "@/components/(dashboard)/batch-products/batch-product-export";

// In page header
<BatchProductExportButton
  batchProducts={dataDatchProductsFiltered}
  title="Danh sách lô sản phẩm"
  variant="button"
/>;
```

## Dependencies Required

```bash
npm install jspdf jspdf-autotable xlsx
```

### Type Declarations

```typescript
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
```

## File Naming Convention

### Automatic Filename Generation

- **Dashboard PDF**: `dashboard-report-{timeRange}-{ddMMyyyy-HHmm}.pdf`
- **Dashboard Excel**: `dashboard-report-{timeRange}-{ddMMyyyy-HHmm}.xlsx`
- **Batch PDF**: `batch-products-{ddMMyyyy-HHmm}.pdf`
- **Batch Excel**: `batch-products-{ddMMyyyy-HHmm}.xlsx`
- **Warehouse Alerts**: `warehouse-alerts-{ddMMyyyy-HHmm}.pdf`

## Color Scheme & Branding

### Agricultural Theme

- **Primary Green**: #44703d (68, 112, 61)
- **Light Green**: #accc8b
- **Table Headers**: Sử dụng primary green
- **Text Colors**: Gray tones cho readability

### Professional Layout

- Consistent spacing và padding
- Bold headers với proper font sizes
- Aligned text và numbers
- Clean table borders

## Toast Notifications

### Success Messages

- "Xuất báo cáo PDF thành công!"
- "Xuất báo cáo Excel thành công!"
- "Xuất báo cáo cảnh báo kho thành công!"

### Error Handling

- "Lỗi khi xuất báo cáo PDF"
- "Lỗi khi xuất báo cáo Excel"
- Console.error với details

## Future Enhancements

### Possible Improvements

1. **Chart Integration**: Embed actual charts in PDF
2. **Email Export**: Send reports via email
3. **Scheduled Reports**: Auto-generate reports
4. **Custom Templates**: User-defined report layouts
5. **Watermarks**: Add company logo/watermark
6. **Digital Signatures**: Sign PDF reports
7. **Report History**: Track exported reports
8. **Bulk Export**: Export multiple time periods

### Advanced Filtering

1. **Date Range Picker**: Custom date ranges
2. **Multi-select**: Specific products/categories
3. **Template Selection**: Different report formats
4. **Language Options**: Multi-language support

Hệ thống xuất báo cáo hiện đã hoàn chỉnh và sẵn sàng sử dụng với giao diện chuyên nghiệp và tính năng đầy đủ! 🎯📊
