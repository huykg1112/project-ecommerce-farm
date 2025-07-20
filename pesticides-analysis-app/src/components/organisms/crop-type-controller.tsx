import { PestAnalysisFormData } from "@/schemas/pest-analysis-schema"
import { Control, FieldError, FieldValues, useController } from "react-hook-form"
import { Input } from "../ui/input"

export function CropTypeController({ control, error, disabled }: {
    control: Control<PestAnalysisFormData, unknown, FieldValues>,
    error?: FieldError,
    disabled: boolean
}) {
    const { field } = useController({
        name: "cropType",
        control,
        defaultValue: ""
    })

    return (
        <>
            <Input
                id="cropType"
                placeholder="Ví dụ: lúa, ngô, cà chua, ớt..."
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
                className={`w-full ${error ? 'border-red-500' : ''}`}
            />
            {error && <p className="text-sm text-red-600">{error.message}</p>}
        </>
    )
}