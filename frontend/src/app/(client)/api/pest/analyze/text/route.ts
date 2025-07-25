import { analyzeTextService } from "@/lib_dashboard/services/ai-service";
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

    if (body.analysisType === "text" && !body.symptoms) {
      return NextResponse.json(
        { error: "Thiếu thông tin triệu chứng" },
        { status: 400 }
      );
    }

    const result = await analyzeTextService(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra trong quá trình xử lý" },
      { status: 500 }
    );
  }
}
