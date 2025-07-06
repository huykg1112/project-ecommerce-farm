"use client"

import { memo, useCallback } from "react"
import { useAtom } from "jotai"
import { timeRangeAtom, type TimeRange } from "@/lib/store/dashboard"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, CalendarDays } from "lucide-react"

const timeRangeOptions = [
  { value: "day" as TimeRange, label: "Hôm nay", icon: Clock },
  { value: "week" as TimeRange, label: "Tuần này", icon: CalendarDays },
  { value: "month" as TimeRange, label: "Tháng này", icon: Calendar },
]

export const TimeRangeSelector = memo(() => {
  const [timeRange, setTimeRange] = useAtom(timeRangeAtom)

  const handleTimeRangeChange = useCallback(
    (newRange: TimeRange) => {
      setTimeRange(newRange)
    },
    [setTimeRange],
  )

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-primary-light/20 rounded-lg border border-primary-light/30">
      {timeRangeOptions.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={timeRange === value ? "default" : "ghost"}
          size="sm"
          onClick={() => handleTimeRangeChange(value)}
          className={`
            flex items-center gap-2 transition-all duration-200
            ${
              timeRange === value
                ? "bg-primary-strong text-white shadow-sm"
                : "text-primary-deep hover:bg-primary-light/30"
            }
          `}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  )
})

TimeRangeSelector.displayName = "TimeRangeSelector"
