import { analyzeImageService } from "@/lib_dashboard/services/ai-service";
import { PestAnalysisRequest } from "@/lib_dashboard/types/pest-analysis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: PestAnalysisRequest = await request.json();

    if (!body.cropType) {
      return NextResponse.json(
        { error: "Thiếu thông tin cây trồng" },
        { status: 400 }
      );
    }

    if (body.analysisType === "image" && !body.imageBase64) {
      return NextResponse.json(
        { error: "Thiếu hình ảnh để phân tích" },
        { status: 400 }
      );
    }

    const result = await analyzeImageService(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra trong quá trình xử lý" },
      { status: 500 }
    );
  }
}
