import { PestAnalysisFormData } from "@/schemas/pest-analysis-schema"
import { Control, FieldError, FieldValues, useController } from "react-hook-form"
import { Textarea } from "../ui/textarea"

export function SymptomsController({ control, error, disabled }: { 
  control: Control<PestAnalysisFormData, unknown, FieldValues>, 
  error?: FieldError, 
  disabled: boolean 
}) {
  const { field } = useController({
    name: "symptoms",
    control,
    defaultValue: ""
  })

  return (
    <>
      <Textarea
        id="symptoms"
        placeholder="Mô tả chi tiết các dấu hiệu bất thường: màu sắc lá, vết đốm, sự xuất hiện của côn trùng, tình trạng cây..."
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        disabled={disabled}
        rows={4}
        className={`w-full resize-none ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </>
  )
}