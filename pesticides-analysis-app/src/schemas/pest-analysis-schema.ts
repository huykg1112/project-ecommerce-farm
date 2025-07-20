import { z } from 'zod'

export const pestAnalysisSchema = z.object({
  cropType: z
    .string()
    .min(1, 'Vui lòng nhập tên cây trồng')
    .min(2, 'Tên cây trồng phải có ít nhất 2 ký tự')
    .max(50, 'Tên cây trồng không được quá 50 ký tự'),
  
  analysisType: z.enum(['text', 'image']),
  
  symptoms: z.string().optional(),
  
  imageBase64: z.string().optional(),
  
  imageMimeType: z.string().optional()
})

export type PestAnalysisFormData = z.infer<typeof pestAnalysisSchema>
