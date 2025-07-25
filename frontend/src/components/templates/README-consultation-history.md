# Hệ thống Lịch sử Tư vấn AI - Consultation History System

## Tổng quan

Hệ thống lưu trữ và quản lý lịch sử tư vấn AI của người dùng sử dụng localStorage, cho phép xem lại các lần tư vấn trước đó.

## Kiến trúc

### 1. LocalStorage Structure

```typescript
Key: "consultation_history_{userId}"
Value: {
  consultations: ConsultationHistory[],
  lastUpdated: timestamp
}
```

### 2. Data Types

```typescript
interface ConsultationHistory {
  id: string; // ID duy nhất
  consultation: AIConsultationInfo; // Dữ liệu tư vấn
  timestamp: number; // Thời gian tạo
  date: string; // ISO date string
}
```

## Components

### 1. Utils: `consultation-history.ts`

**Chức năng:**

- `saveConsultationToHistory()` - Lưu tư vấn mới
- `getUserConsultationHistory()` - Lấy toàn bộ lịch sử
- `getConsultationById()` - Lấy một tư vấn cụ thể
- `deleteConsultationFromHistory()` - Xóa một tư vấn
- `clearUserConsultationHistory()` - Xóa toàn bộ lịch sử
- `getConsultationStats()` - Thống kê lịch sử

**Features:**

- Giới hạn tối đa 50 lịch sử per user
- Sắp xếp theo thời gian mới nhất
- Error handling đầy đủ
- Auto-generate unique IDs

### 2. Component: `ConsultationHistoryModal`

**Chức năng:**

- Hiển thị danh sách lịch sử trong modal
- Thống kê nhanh (tổng, tháng này, loại bệnh, loại cây)
- Xem chi tiết từng tư vấn
- Xóa từng tư vấn hoặc toàn bộ
- Responsive design

**Features:**

- Search và filter (có thể mở rộng)
- Pagination khi có nhiều dữ liệu
- Export data (có thể mở rộng)

### 3. Integration: `pest-analysis-form.tsx`

**Cập nhật:**

- Import `saveConsultationToHistory`
- Import `ConsultationHistoryModal`
- Thêm nút "Lịch sử tư vấn"
- Auto-save sau khi có kết quả (bất kể confidence score)

## Quy trình hoạt động

### 1. Lưu tự động

```typescript
// Trong onSubmit của pest-analysis-form
const response = await getPestAnalysis(requestData);
setResult(response);

// Lưu vào localStorage (luôn luôn)
if (userId) {
  saveConsultationToHistory(userId, response);
}

// Lưu vào database (chỉ khi confidence >= 60%)
if (response.confidence_score >= 60) {
  // Save to database...
}
```

### 2. Xem lịch sử

```typescript
// User click nút "Lịch sử tư vấn"
// → Mở ConsultationHistoryModal
// → Load dữ liệu từ localStorage
// → Hiển thị danh sách + stats
```

### 3. Quản lý dữ liệu

- **Lưu:** Tự động sau mỗi lần tư vấn
- **Xem:** Click vào modal history
- **Xóa:** Individual delete hoặc clear all
- **Tìm kiếm:** Theo tên cây, bệnh, ngày tháng

## UI/UX Features

### 1. Statistics Dashboard

- Tổng số tư vấn
- Tư vấn tháng này
- Số loại bệnh đã gặp
- Số loại cây đã tư vấn

### 2. History List

- Card layout với thông tin tóm tắt
- Badge cho confidence score và severity
- Quick actions: View detail, Delete
- Responsive grid

### 3. Detail View

- Full consultation information
- Treatment plans expansion
- Recommended products links
- Copy/share functionality (future)

## Security & Performance

### 1. Data Limits

- Max 50 consultations per user
- Auto-cleanup old data
- Efficient JSON storage

### 2. Error Handling

- Try-catch for all localStorage operations
- Fallback for corrupted data
- User-friendly error messages

### 3. Privacy

- Data stored locally only
- No sensitive information exposure
- User can clear all data anytime

## Future Enhancements

### 1. Features

- Export to PDF/Word
- Share consultation results
- Search and filter functionality
- Data visualization charts
- Offline sync with database

### 2. Performance

- Lazy loading for large histories
- Virtual scrolling
- Data compression
- Background cleanup

### 3. Analytics

- Usage tracking
- Popular diseases/crops
- Treatment effectiveness
- User behavior insights

## Usage Example

```typescript
// Trong component khác
import { ConsultationHistoryModal } from '@/components/templates/consultation-history-modal';

// Sử dụng với custom trigger
<ConsultationHistoryModal
  trigger={
    <Button variant="ghost">
      <History className="w-4 h-4 mr-2" />
      Xem lịch sử
    </Button>
  }
/>

// Hoặc sử dụng trigger mặc định
<ConsultationHistoryModal />
```

## API Reference

### Utils Functions

```typescript
// Lưu tư vấn mới
saveConsultationToHistory(userId: string, consultation: AIConsultationInfo): void

// Lấy lịch sử user
getUserConsultationHistory(userId: string): UserConsultationHistory

// Lấy tư vấn theo ID
getConsultationById(userId: string, consultationId: string): ConsultationHistory | null

// Xóa tư vấn
deleteConsultationFromHistory(userId: string, consultationId: string): boolean

// Xóa toàn bộ
clearUserConsultationHistory(userId: string): boolean

// Thống kê
getConsultationStats(userId: string): ConsultationStats
```
