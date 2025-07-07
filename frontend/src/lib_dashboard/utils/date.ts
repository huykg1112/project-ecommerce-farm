import { formatDistanceToNow, format } from "date-fns"
import { vi } from "date-fns/locale"

export const formatTimeAgo = (date: Date): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: vi,
  })
}

export const formatDate = (date: Date, formatStr = "dd/MM/yyyy"): string => {
  return format(date, formatStr, { locale: vi })
}
