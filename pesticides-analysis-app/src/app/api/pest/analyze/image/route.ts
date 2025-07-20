import { NextRequest, NextResponse } from 'next/server'
import { PestAnalysisRequest } from '@/types/pest-analysis'
import { analyzeImageService } from '@/services/ai-service'

export async function POST(request: NextRequest) {
    try {
        const body: PestAnalysisRequest = await request.json()

        if (!body.cropType) {
            return NextResponse.json(
                { error: 'Thiếu thông tin cây trồng' },
                { status: 400 }
            )
        }

        if (body.analysisType === 'image' && !body.imageBase64) {
            return NextResponse.json(
                { error: 'Thiếu hình ảnh để phân tích' },
                { status: 400 }
            )
        }

        const result = await analyzeImageService(body)

        return NextResponse.json(result)
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Có lỗi xảy ra trong quá trình xử lý' },
            { status: 500 }
        )
    }
}