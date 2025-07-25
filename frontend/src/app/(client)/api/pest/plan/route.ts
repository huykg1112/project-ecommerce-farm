import { generateImplementationPlan } from "@/lib_dashboard/services/ai-service";
import { ImplementationPlanRequest } from "@/lib_dashboard/types/pest-analysis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: ImplementationPlanRequest = await request.json();

    if (!body.pestOrDisease || !body.cropType || !body.currentDate) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    const result = await generateImplementationPlan(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating implementation plan:", error);
    return NextResponse.json(
      { error: "Có lỗi xảy ra khi tạo kế hoạch triển khai" },
      { status: 500 }
    );
  }
}
