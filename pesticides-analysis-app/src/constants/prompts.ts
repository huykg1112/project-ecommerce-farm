export function getTextAiPrompt(symptoms: string, cropType: string) {
  return {
    contents: [
      {
        parts: [
          {
            text: `Dựa trên mô tả dấu hiệu bất thường của cây trồng '${symptoms}' trên cây '${cropType}', đề xuất danh sách các loại sâu bệnh và bệnh lý cây trồng có thể xảy ra. Mỗi sâu bệnh hoặc bệnh lý phải bao gồm đầy đủ: tên, nguyên nhân, hậu quả, biện pháp xử lý, loại thuốc trừ sâu hoặc phân bón phù hợp, thời điểm áp dụng, liều lượng, và lưu ý an toàn. Đảm bảo tất cả các thuộc tính được khai báo trong schema (cropType, cropSymptom, possiblePestsOrDiseases, additionalInfo, và các thuộc tính con của possiblePestsOrDiseases bao gồm name, cause, impact, treatment, method, recommendedProducts, applicationTiming, dosage, safetyNotes) đều được điền đầy đủ, không được bỏ qua bất kỳ thuộc tính nào, kể cả khi thông tin rỗng (sử dụng giá trị mặc định như 'Không có thông tin' hoặc mảng rỗng [] nếu không áp dụng). Sử dụng các từ khóa như 'sâu bệnh', 'bệnh lý cây trồng', 'thuốc trừ sâu', 'phân bón', 'dấu hiệu bất thường', 'nguyên nhân', 'hậu quả' để hỗ trợ tìm kiếm trong cơ sở dữ liệu. Cung cấp thêm thông tin bổ sung như biện pháp phòng ngừa, điều kiện môi trường liên quan, hoặc mẹo canh tác để tối ưu hóa hiệu quả.`,
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
            description:
              "Tên cây trồng được mô tả (ví dụ: lúa, ngô, cà chua). Bắt buộc điền.",
          },
          cropSymptom: {
            type: "STRING",
            description:
              "Mô tả dấu hiệu bất thường của cây trồng (ví dụ: lá vàng, đốm nâu, héo rũ, côn trùng xuất hiện). Bắt buộc điền.",
          },
          possiblePestsOrDiseases: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: {
                  type: "STRING",
                  description:
                    "Tên sâu bệnh hoặc bệnh lý cây trồng (ví dụ: sâu đục thân, bệnh đốm lá). Bắt buộc điền.",
                },
                cause: {
                  type: "STRING",
                  description:
                    "Nguyên nhân gây ra sâu bệnh hoặc bệnh lý (ví dụ: nấm, vi khuẩn, côn trùng, thiếu dinh dưỡng). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin.",
                },
                impact: {
                  type: "STRING",
                  description:
                    "Hậu quả của sâu bệnh hoặc bệnh lý đối với cây trồng (ví dụ: giảm năng suất, cây chết). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin.",
                },
                treatment: {
                  type: "OBJECT",
                  properties: {
                    method: {
                      type: "STRING",
                      description:
                        "Biện pháp xử lý cụ thể (ví dụ: phun thuốc trừ sâu, cải tạo đất, tỉa lá). Bắt buộc điền, sử dụng 'Không có biện pháp' nếu không áp dụng.",
                    },
                    recommendedProducts: {
                      type: "ARRAY",
                      items: {
                        type: "STRING",
                        description:
                          "Tên thuốc trừ sâu hoặc phân bón phù hợp (ví dụ: Actara, NPK 20-20-15). Bắt buộc điền, trả về mảng rỗng [] nếu không có sản phẩm.",
                      },
                    },
                    applicationTiming: {
                      type: "STRING",
                      description:
                        "Thời điểm áp dụng biện pháp (ví dụ: sáng sớm, sau mưa, trước khi ra hoa). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin.",
                    },
                    dosage: {
                      type: "STRING",
                      description:
                        "Liều lượng sử dụng (ví dụ: 10ml thuốc/lít nước, 50g phân bón/cây). Bắt buộc điền, sử dụng 'Không xác định' nếu không có thông tin.",
                    },
                    safetyNotes: {
                      type: "STRING",
                      description:
                        "Lưu ý an toàn khi sử dụng thuốc hoặc phân bón (ví dụ: mang khẩu trang, tránh phun gần nguồn nước). Bắt buộc điền, sử dụng 'Không có lưu ý' nếu không áp dụng.",
                    },
                  },
                  required: [
                    "method",
                    "recommendedProducts",
                    "applicationTiming",
                    "dosage",
                    "safetyNotes",
                  ],
                },
              },
              required: ["name", "cause", "impact", "treatment"],
            },
          },
          additionalInfo: {
            type: "STRING",
            description:
              "Thông tin bổ sung về phòng ngừa sâu bệnh, điều kiện môi trường ảnh hưởng (như độ ẩm, nhiệt độ), hoặc mẹo canh tác để giảm nguy cơ tái phát. Bắt buộc điền, sử dụng 'Không có thông tin' nếu không có dữ liệu.",
          },
        },
        required: [
          "cropType",
          "cropSymptom",
          "possiblePestsOrDiseases",
          "additionalInfo",
        ],
        propertyOrdering: [
          "cropType",
          "cropSymptom",
          "possiblePestsOrDiseases",
          "additionalInfo",
        ],
      },
    },
  };
}

export function getImageAiPrompt(cropType: string) {
  return `Dựa trên hình ảnh cây trồng và loại cây '${cropType}', thực hiện phân tích để nhận diện các dấu hiệu bất thường và đề xuất danh sách các loại sâu bệnh hoặc bệnh lý cây trồng có thể xảy ra. Nếu hình ảnh không có liên quan, hãy phản hồi rằng "Hình ảnh được cung cấp không hợp lệ".`;
}

export function getInValidResponse(cropType: string) {
  return {
    cropType: cropType || "Không có thông tin",
    cropSymptom: "Không có thông tin",
    possiblePestsOrDiseases: [],
    additionalInfo: "Không có thông tin",
  };
}
