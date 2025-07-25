import { Treatment } from "@/lib_dashboard/types/pest-analysis";

export function getTextAiPrompt(
  symptoms: string,
  cropType: string,
  growthStage?: string
) {
  const growthStageText = growthStage
    ? ` Cây đang ở giai đoạn: ${growthStage}.`
    : "";

  return {
    contents: [
      {
        parts: [
          {
            text: `Bạn là chuyên gia bảo vệ thực vật với 20 năm kinh nghiệm tại Việt Nam. Nhiệm vụ phân tích triệu chứng '${symptoms}' của cây trồng '${cropType}'.${growthStageText}

⚠️ QUY TẮC NGÔN NGỮ NGHIÊM KHẮT:
- TUYỆT ĐỐI chỉ sử dụng tiếng Việt thuần túy
- KHÔNG được sử dụng bất kỳ ký tự nào khác (中文, 日本語, 한국어, English)
- Sử dụng từ ngữ chuyên môn nông nghiệp Việt Nam
- Kiểm tra kỹ từng ký tự trước khi trả lời

🔬 QUY TRÌNH CHẨN ĐOÁN VÀ TỰ THẨM ĐỊNH:

1. PHÂN TÍCH TRIỆU CHỨNG:
   - Xác định triệu chứng chính và phụ
   - So sánh với cơ sở dữ liệu bệnh hại
   - Tính toán tỷ lệ chính xác (0-100%)

2. CHẨN ĐOÁN BỆNH:
   - Tên bệnh chính xác (tiếng Việt + tên khoa học)
   - Nguyên nhân: nấm/vi khuẩn/virus/côn trùng/dinh dưỡng
   - Mức độ: nhẹ/trung bình/nặng

3. THUỐC BVTV VIỆT NAM:
   Chỉ sử dụng thuốc có giấy phép lưu hành:
   - Thuốc trừ nấm: Score 250EC, Amistar Top 325SC, Antracol 70WP, Ridomil Gold 68WG
   - Thuốc trừ sâu: Actara 25WG, Confidor 200SL, Regent 800WG, Karate Zeon 50CS
   - Thuốc trừ cỏ: Roundup 480SL, Gramoxone 276SL
   - Kích thích sinh trưởng: Atonik 1.8DD, Green Fert

4. PHÁC ĐỒ ĐIỀU TRỊ LOGIC:
   - Từng ngày liên tục (1→2→3→...)
   - Chuẩn bị → Điều trị → Theo dõi → Đánh giá
   - Liều lượng chính xác theo nhãn thuốc

5. TỰ THẨM ĐỊNH CHẤT LƯỢNG:
   - Kiểm tra độ chính xác chẩn đoán
   - Đánh giá độ tin cậy khuyến nghị
   - Xác định yếu tố không chắc chắn
   - Đề xuất cần tham khảo chuyên gia hay không

THUỐC BVTV CÓ THẬT TẠI VIỆT NAM:
Actara 25WG, Confidor 200SL, Score 250EC, Amistar Top 325SC, Antracol 70WP, Ridomil Gold 68WG, Regent 800WG, Karate Zeon 50CS, Roundup 480SL, Gramoxone 276SL, Atonik 1.8DD, Green Fert NPK

🔍 KIỂM TRA CUỐI CÙNG:
- Đọc lại toàn bộ từng từ
- Đảm bảo 100% tiếng Việt
- Không có ký tự lạ
- Thuốc phải có thật
- Logic điều trị khoa học
- Tỷ lệ chính xác hợp lý`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          crop_type: {
            type: "STRING",
            description: "Tên cây trồng được phân tích",
          },
          symptom_description: {
            type: "STRING",
            description: "Mô tả chi tiết triệu chứng quan sát được",
          },
          growth_stage: {
            type: "STRING",
            description:
              "Giai đoạn sinh trưởng của cây (mầm, cây con, sinh trưởng, ra hoa, kết trái, thu hoạch)",
          },
          disease_name: {
            type: "STRING",
            description: "Tên bệnh chính xác (bao gồm tên khoa học nếu có)",
          },
          disease_cause: {
            type: "STRING",
            description:
              "Nguyên nhân gây bệnh (nấm, vi khuẩn, virus, côn trùng, dinh dưỡng)",
          },
          severity_level: {
            type: "STRING",
            description: "Mức độ nghiêm trọng (Nhẹ/Trung bình/Nặng)",
          },
          confidence_score: {
            type: "NUMBER",
            description: "Tỷ lệ chính xác chẩn đoán từ 0-100",
          },
          diagnosis_confidence: {
            type: "STRING",
            description: "Mức độ tin cậy (cao/trung bình/thấp)",
          },
          recommended_products: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: {
                  type: "STRING",
                  description: "Tên thương mại thuốc BVTV hoặc phân bón",
                },
                active_ingredient: {
                  type: "STRING",
                  description: "Hoạt chất chính",
                },
                concentration: {
                  type: "STRING",
                  description: "Nồng độ (ví dụ: 25% EC, 10% WP)",
                },
                usage_note: {
                  type: "STRING",
                  description: "Ghi chú sử dụng",
                },
              },
              required: ["name"],
            },
          },
          recommended_treatment: {
            type: "STRING",
            description: "Phác đồ điều trị tổng quan",
          },
          treatment_duration: {
            type: "NUMBER",
            description: "Thời gian điều trị tổng cộng (số ngày)",
          },
          treatment_plans: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                day_number: {
                  type: "NUMBER",
                  description: "Số ngày thứ tự (liên tục từ 1, 2, 3...)",
                },
                step_title: {
                  type: "STRING",
                  description: "Tiêu đề bước điều trị",
                },
                treatment_instruction: {
                  type: "STRING",
                  description: "Hướng dẫn điều trị chi tiết cho ngày này",
                },
                dosage_instruction: {
                  type: "STRING",
                  description: "Hướng dẫn liều lượng và pha chế cụ thể",
                },
                frequency: {
                  type: "STRING",
                  description: "Tần suất thực hiện trong ngày",
                },
                products_used: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                    description: "Tên thuốc sử dụng trong ngày này",
                  },
                },
                safety_notes: {
                  type: "STRING",
                  description: "Lưu ý an toàn cho bước này",
                },
                expected_result: {
                  type: "STRING",
                  description: "Kết quả mong đợi sau bước này",
                },
              },
              required: ["day_number", "step_title", "treatment_instruction"],
            },
          },
          prevention_tips: {
            type: "ARRAY",
            items: {
              type: "STRING",
              description: "Mẹo phòng ngừa bệnh",
            },
          },
          monitoring_signs: {
            type: "ARRAY",
            items: {
              type: "STRING",
              description: "Dấu hiệu cần theo dõi trong quá trình điều trị",
            },
          },
          self_assessment: {
            type: "OBJECT",
            properties: {
              accuracy_check: {
                type: "STRING",
                description: "Kiểm tra độ chính xác của chẩn đoán",
              },
              alternative_diagnosis: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  description: "Các chẩn đoán khác có thể",
                },
              },
              uncertainty_factors: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  description: "Các yếu tố gây không chắc chắn",
                },
              },
              recommendation_reliability: {
                type: "STRING",
                description: "Độ tin cậy của khuyến nghị",
              },
              need_expert_consultation: {
                type: "BOOLEAN",
                description: "Có cần tham khảo chuyên gia không",
              },
              additional_tests_needed: {
                type: "ARRAY",
                items: {
                  type: "STRING",
                  description: "Các kiểm tra bổ sung cần thiết",
                },
              },
            },
            required: [
              "accuracy_check",
              "recommendation_reliability",
              "need_expert_consultation",
            ],
          },
        },
        required: [
          "crop_type",
          "symptom_description",
          "growth_stage",
          "disease_name",
          "disease_cause",
          "severity_level",
          "confidence_score",
          "diagnosis_confidence",
          "recommended_products",
          "recommended_treatment",
          "treatment_duration",
          "treatment_plans",
          "self_assessment",
        ],
      },
    },
  };
}

export function getImageAiPrompt(cropType: string) {
  return `Dựa trên hình ảnh cây trồng và loại cây '${cropType}', thực hiện phân tích để nhận diện các dấu hiệu bất thường và đề xuất danh sách các loại sâu bệnh hoặc bệnh lý cây trồng có thể xảy ra. Nếu hình ảnh không có liên quan hoặc không phải loại cây '${cropType}', hãy phản hồi rằng "Hình ảnh được cung cấp không hợp lệ".`;
}

export function getInValidResponse(cropType: string, content: string) {
  return {
    crop_type: cropType,
    symptom_description: content,
    growth_stage: "Không xác định",
    disease_name: "Không xác định",
    disease_cause: "Không xác định",
    severity_level: "Không xác định",
    confidence_score: 0,
    diagnosis_confidence: "thấp",
    recommended_products: [],
    recommended_treatment: "Không có thông tin",
    treatment_duration: 0,
    treatment_plans: [],
    prevention_tips: [],
    monitoring_signs: [],
    self_assessment: {
      accuracy_check: "Không thể xác định do thiếu thông tin",
      recommendation_reliability: "Rất thấp",
      need_expert_consultation: true,
    },
  };
}

export function getImplementationPlanPrompt(
  pestName: string,
  cropType: string,
  treatment: Treatment,
  currentDate: string
) {
  return {
    contents: [
      {
        parts: [
          {
            text: `Dựa trên thông tin về sâu bệnh '${pestName}' trên cây '${cropType}' và biện pháp xử lý đã được đề xuất, hãy tạo một kế hoạch triển khai chi tiết theo từng ngày. Ngày hiện tại là ${currentDate}. 

Thông tin biện pháp xử lý:
- Phương pháp: ${treatment.method}
- Sản phẩm khuyến nghị: ${treatment.recommendedProducts.join(", ")}
- Thời điểm áp dụng: ${treatment.applicationTiming}
- Liều lượng: ${treatment.dosage}
- Lưu ý an toàn: ${treatment.safetyNotes}

Hãy tạo một kế hoạch thực hiện chi tiết từ ngày ${currentDate}, bao gồm các bước chuẩn bị, triển khai, theo dõi và đánh giá hiệu quả. Mỗi bước phải có ngày cụ thể, mô tả công việc, danh sách vật tư cần thiết và ghi chú quan trọng.`,
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          cropType: {
            type: "STRING",
            description: "Tên cây trồng. Bắt buộc điền.",
          },
          pestName: {
            type: "STRING",
            description: "Tên sâu bệnh cần xử lý. Bắt buộc điền.",
          },
          planStartDate: {
            type: "STRING",
            description:
              "Ngày bắt đầu kế hoạch (định dạng YYYY-MM-DD). Bắt buộc điền.",
          },
          planEndDate: {
            type: "STRING",
            description:
              "Ngày kết thúc kế hoạch (định dạng YYYY-MM-DD). Bắt buộc điền.",
          },
          totalDuration: {
            type: "INTEGER",
            description:
              "Tổng thời gian thực hiện kế hoạch (số ngày). Bắt buộc điền.",
          },
          steps: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                day: {
                  type: "INTEGER",
                  description:
                    "Ngày thứ mấy trong kế hoạch (bắt đầu từ 1). Bắt buộc điền.",
                },
                date: {
                  type: "STRING",
                  description:
                    "Ngày thực hiện (định dạng YYYY-MM-DD). Bắt buộc điền.",
                },
                title: {
                  type: "STRING",
                  description: "Tiêu đề công việc của ngày đó. Bắt buộc điền.",
                },
                description: {
                  type: "STRING",
                  description:
                    "Mô tả chi tiết công việc cần làm. Bắt buộc điền.",
                },
                tasks: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                    description: "Danh sách các nhiệm vụ cụ thể trong ngày.",
                  },
                },
                materials: {
                  type: "ARRAY",
                  items: {
                    type: "STRING",
                    description: "Danh sách vật tư, dụng cụ cần thiết.",
                  },
                },
                notes: {
                  type: "STRING",
                  description: "Ghi chú quan trọng (tuỳ chọn).",
                },
                isUrgent: {
                  type: "BOOLEAN",
                  description: "Có phải công việc khẩn cấp không (tuỳ chọn).",
                },
              },
              required: [
                "day",
                "date",
                "title",
                "description",
                "tasks",
                "materials",
              ],
            },
          },
          generalNotes: {
            type: "STRING",
            description: "Ghi chú chung cho toàn bộ kế hoạch. Bắt buộc điền.",
          },
          successIndicators: {
            type: "ARRAY",
            items: {
              type: "STRING",
              description: "Các dấu hiệu cho thấy kế hoạch thành công.",
            },
          },
        },
        required: [
          "cropType",
          "pestName",
          "planStartDate",
          "planEndDate",
          "totalDuration",
          "steps",
          "generalNotes",
          "successIndicators",
        ],
      },
    },
  };
}
