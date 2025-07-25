# Tích hợp AI Consultation Service vào Pest Analysis Form

## Tổng quan

File `pest-analysis-form.tsx` đã được tích hợp với `ai_ConsultationServiceManagement` để tự động lưu kết quả tư vấn AI vào cơ sở dữ liệu sau khi phân tích thành công.

## Quy trình hoạt động

### 1. Phân tích AI

- Người dùng nhập thông tin cây trồng và triệu chứng
- Gọi `getPestAnalysis()` để nhận kết quả từ AI
- Hiển thị kết quả phân tích cho người dùng

### 2. Lưu tự động vào Database (với điều kiện)

- Sau khi nhận được kết quả từ AI, hệ thống kiểm tra điều kiện:
  - **Điều kiện**: `confidence_score >= 60%`
  - Nếu đạt điều kiện:
    - Convert dữ liệu từ `AIConsultationInfo` sang `AIConsultationCreateRequest`
    - Gọi `ai_ConsultationServiceManagement.createAIConsultation()`
    - Lưu kết quả vào cơ sở dữ liệu
    - Hiển thị thông báo thành công
  - Nếu không đạt điều kiện:
    - Không lưu tự động
    - Hiển thị cảnh báo độ tin cậy thấp
    - Kết quả vẫn được hiển thị cho người dùng

### 3. Hiển thị trạng thái

- Hiển thị thông báo thành công khi lưu dữ liệu thành công (confidence >= 60%)
- Hiển thị cảnh báo khi độ tin cậy thấp (confidence < 60%)
- Log lỗi vào console nếu việc lưu thất bại (không ảnh hưởng đến trải nghiệm người dùng)

## Chuyển đổi dữ liệu

### Từ AIConsultationInfo sang AIConsultationCreateRequest:

```typescript
// Arrays được chuyển thành chuỗi phân tách bằng dấu phẩy
recommended_products -> recommended_name_products (string)
prevention_tips -> prevention_tips (string)
monitoring_signs -> monitoring_signs (string)

// Treatment plans được map sang format mới
treatment_plans -> treatment_plans (TreatmentPlanCreateRequest[])
```

## States mới được thêm

- `saveSuccess`: boolean - theo dõi trạng thái lưu thành công
- `lowConfidenceWarning`: boolean - theo dõi trạng thái cảnh báo độ tin cậy thấp
- Cập nhật `loadingWords` để bao gồm bước "💾 Đang lưu kết quả..."

## Điều kiện lưu tự động

**Confidence Score Threshold: >= 60%**

- Chỉ kết quả có độ tin cậy từ 60% trở lên mới được lưu tự động
- Kết quả dưới 60% sẽ hiển thị cảnh báo và không lưu vào database
- Người dùng vẫn thấy được kết quả phân tích bất kể độ tin cậy

## Error Handling

- Lỗi trong quá trình lưu không làm gián đoạn trải nghiệm người dùng
- Kết quả phân tích vẫn được hiển thị ngay cả khi lưu thất bại
- Độ tin cậy thấp không phải lỗi - chỉ là cảnh báo
- Lỗi được log vào console để debug

## UI Updates

- Thêm card thông báo thành công màu xanh khi lưu dữ liệu thành công (confidence >= 60%)
- Thêm card cảnh báo màu vàng khi độ tin cậy thấp (confidence < 60%)
- Cards hiển thị với icon và thông báo rõ ràng
- Positioning ngay trước card kết quả chính

## Dependencies mới

```typescript
import { ai_ConsultationServiceManagement } from "@/lib_dashboard/services/ai-consultation-service";
import { AIConsultationCreateRequest } from "@/lib_dashboard/types/ai-consultation";
```
